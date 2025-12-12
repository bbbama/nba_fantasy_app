from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

import auth, models, schemas
from models import get_db, create_tables

# Utworzenie tabel przy starcie aplikacji (jeśli nie istnieją)
# W środowisku produkcyjnym lepiej użyć Alembic do migracji
create_tables()

app = FastAPI()

# TODO: Skonfigurować CORS prawidłowo dla frontendu
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost",
    "http://localhost:3000", # Adres deweloperski aplikacji React
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Endpoint do rejestracji nowego użytkownika."""
    db_user = auth.get_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login", response_model=schemas.Token)
def login_for_access_token(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Endpoint do logowania i uzyskiwania tokena JWT."""
    user = auth.get_user(db, email=user_credentials.email)
    if not user or not auth.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/")
def read_root():
    """Główny endpoint, weryfikujący działanie aplikacji."""
    return {"message": "Welcome to NBA Fantasy API"}

# Przykład zabezpieczonego endpointu
@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    """Pobiera dane zalogowanego użytkownika."""
    return current_user

# Endpointy do zarządzania zawodnikami

@app.post("/players", response_model=schemas.Player)
def create_player(
    player: schemas.PlayerCreate, 
    db: Session = Depends(get_db), 
    current_admin: models.User = Depends(auth.get_current_active_admin)
):
    """
    [Admin only] Endpoint do tworzenia nowego zawodnika.
    """
    db_player = models.Player(**player.dict())
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

@app.get("/players", response_model=list[schemas.Player])
def get_all_players(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Endpoint do pobierania listy wszystkich zawodników.
    Dostępny dla każdego zalogowanego użytkownika.
    """
    
    players = db.query(models.Player).filter(models.Player.is_active == True).all()
    return players

# Endpointy do zarządzania drużyną użytkownika

@app.get("/me/team", response_model=list[schemas.Player])
def get_my_team(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Pobiera listę zawodników w drużynie aktualnie zalogowanego użytkownika.
    """
    return current_user.players

@app.post("/me/team/players/{player_id}", response_model=schemas.Player)
def add_player_to_team(
    player_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Dodaje jednego zawodnika do drużyny użytkownika."""
    # Sprawdzenie, czy drużyna nie jest pełna
    if len(current_user.players) >= 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your team is full. You can have a maximum of 10 players."
        )

    # Sprawdzenie, czy zawodnik istnieje
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found."
        )
    
    # Sprawdzenie, czy zawodnik nie jest już w drużynie
    if player in current_user.players:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Player is already in your team."
        )

    # Dodanie zawodnika do drużyny
    current_user.players.append(player)
    db.commit()
    db.refresh(player)
    return player

@app.delete("/me/team/players/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_player_from_team(
    player_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Usuwa jednego zawodnika z drużyny użytkownika."""
    # Sprawdzenie, czy zawodnik istnieje
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found."
        )

    # Sprawdzenie, czy zawodnik jest w drużynie
    if player not in current_user.players:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Player is not in your team."
        )

    # Usunięcie zawodnika z drużyny
    current_user.players.remove(player)
    db.commit()
    return
