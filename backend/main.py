import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload
from datetime import timedelta, datetime # Added datetime for daily points
from typing import List # Added for List type hint
import secrets # Added for invite code generation
import string # Added for invite code generation
from apscheduler.schedulers.background import BackgroundScheduler
from scripts.fetch_nba_players import update_stats_for_active_players
import atexit

import auth, models, schemas
from models import get_db, create_tables

app = FastAPI()

@app.on_event("startup")
def startup_event():
    create_tables()

# TODO: Skonfigurować CORS prawidłowo dla frontendu
import os  # Add at top
from fastapi.middleware.cors import CORSMiddleware

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

origins = [
    "http://localhost",
    "http://localhost:3000",
    FRONTEND_URL,  # Production frontend URL
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

    if user.nickname: # Check only if nickname is provided
        db_nickname_user = db.query(models.User).filter(models.User.nickname == user.nickname).first()
        if db_nickname_user:
            raise HTTPException(status_code=400, detail="Nickname already registered")

    # Check if this is the first user
    is_first_user = db.query(models.User).count() == 0
    user_role = "admin" if is_first_user else "user"

    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        nickname=user.nickname, # Save the nickname
        hashed_password=hashed_password,
        role=user_role
    )
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

@app.put("/users/me", response_model=schemas.User)
def update_user_profile(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Pozwala zalogowanemu użytkownikowi na aktualizację danych profilowych (np. nicku)."""
    if user_update.nickname is not None:
        if user_update.nickname == current_user.nickname:
            # No change in nickname, return current user
            return current_user
            
        # Check if new nickname is unique
        existing_user_with_nickname = db.query(models.User).filter(
            models.User.nickname == user_update.nickname
        ).first()
        if existing_user_with_nickname:
            raise HTTPException(status_code=400, detail="Nickname already registered")
        
        current_user.nickname = user_update.nickname
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/users/me/daily_fantasy_points", response_model=schemas.DailyFantasyPoints)
def get_user_daily_fantasy_points(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Pobiera łączne punkty fantasy użytkownika z dzisiaj oraz punkty poszczególnych graczy."""
    today = datetime.now().strftime("%Y-%m-%d") # Format: YYYY-MM-DD

    total_today_points = 0.0
    player_points_breakdown = []

    for player_in_team in current_user.players:
        player_stats_today = db.query(models.PlayerGameStats).filter(
            models.PlayerGameStats.player_id == player_in_team.id,
            models.PlayerGameStats.game_date == today
        ).first()

        if player_stats_today:
            total_today_points += player_stats_today.fantasy_points
            player_points_breakdown.append({
                "player_name": player_in_team.full_name,
                "points": player_stats_today.fantasy_points
            })
    
    return schemas.DailyFantasyPoints(
        total_today_points=total_today_points,
        player_points_breakdown=player_points_breakdown
    )

@app.put("/users/me/change-password", status_code=status.HTTP_204_NO_CONTENT)
def change_current_user_password(
    passwords: schemas.ChangePassword,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Pozwala zalogowanemu użytkownikowi na zmianę własnego hasła."""
    # Weryfikacja obecnego hasła
    if not auth.verify_password(passwords.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password.")

    # Sprawdzenie, czy nowe hasła się zgadzają
    if passwords.new_password != passwords.confirm_new_password:
        raise HTTPException(status_code=400, detail="New passwords do not match.")

    # Walidacja siły nowego hasła (prosty przykład)
    if len(passwords.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")

    # Hashowanie i aktualizacja hasła
    current_user.hashed_password = auth.get_password_hash(passwords.new_password)
    db.commit()

    return

# --- League Endpoints ---
def generate_invite_code(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for i in range(length))

@app.post("/leagues", response_model=schemas.League)
def create_league(
    league: schemas.LeagueCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Tworzy nową ligę."""
    # Ensure league name is unique (optional, but good practice)
    existing_league = db.query(models.League).filter(models.League.name == league.name).first()
    if existing_league:
        raise HTTPException(status_code=400, detail="League with this name already exists")

    invite_code = generate_invite_code()
    # Ensure invite code is unique
    while db.query(models.League).filter(models.League.invite_code == invite_code).first():
        invite_code = generate_invite_code()

    db_league = models.League(
        name=league.name,
        owner_id=current_user.id,
        invite_code=invite_code
    )
    db.add(db_league)
    db.commit()
    db.refresh(db_league)

    # Add current user (owner) as a member of the league
    current_user.leagues.append(db_league)
    db.commit()
    db.refresh(current_user) # Refresh user to include new league relationship
    
    return db_league

@app.get("/leagues", response_model=List[schemas.League])
def get_user_leagues(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Pobiera listę lig, których użytkownik jest członkiem (lub wszystkie, jeśli użytkownik jest administratorem)."""
    if current_user.role == "admin":
        # Admin can see all leagues
        return db.query(models.League).options(joinedload(models.League.users)).all()
    else:
        # Regular user can only see their own leagues
        return db.query(models.User).options(joinedload(models.User.leagues).joinedload(models.League.users)).filter(models.User.id == current_user.id).first().leagues # Eager load users for each league

@app.get("/leagues/{league_id}", response_model=schemas.League)
def get_league_details(
    league_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Pobiera szczegóły konkretnej ligi."""
    league = db.query(models.League).options(joinedload(models.League.users)).filter(models.League.id == league_id).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")

    # Check if current user is a member of the league
    if current_user not in league.users:
        raise HTTPException(status_code=403, detail="Not a member of this league")
    
    return league

@app.post("/leagues/join/{invite_code}", response_model=schemas.League)
def join_league(
    invite_code: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Użytkownik dołącza do ligi za pomocą kodu zaproszenia."""
    league = db.query(models.League).filter(models.League.invite_code == invite_code).first()
    if not league:
        raise HTTPException(status_code=404, detail="Invalid invite code or league not found")
    
    # Check if user is already a member
    if current_user in league.users:
        raise HTTPException(status_code=400, detail="Already a member of this league")
    
    current_user.leagues.append(league)
    db.commit()
    db.refresh(current_user) # Refresh user to include new league relationship
    
    return league

@app.delete("/leagues/{league_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_league(
    league_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Usuwa ligę (tylko dla właściciela lub administratora)."""
    league = db.query(models.League).filter(models.League.id == league_id).first()
    if not league:
        raise HTTPException(status_code=404, detail="League not found")
    
    # Authorization check: only owner or admin can delete
    if league.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this league")
    
    db.delete(league)
    db.commit()
    return


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
    
    players = db.query(models.Player).options(joinedload(models.Player.game_stats)).filter(models.Player.is_active == True).all()
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
    return db.query(models.User).options(joinedload(models.User.players).joinedload(models.Player.game_stats)).filter(models.User.id == current_user.id).first().players

MAX_TOTAL_PLAYERS = 10
MAX_POSITIONS = {
    "Guard": 4,
    "Forward": 4,
    "Center": 2,
}

# Mapping NBA positions to general fantasy positions (a player can fit into multiple)
# For simplicity, if a player is 'G-F', they can fill either a Guard OR a Forward slot.
# We'll try to find a slot that fits.
POSITION_MAPPING_RULES = {
    "G": ["Guard"],
    "F": ["Forward"],
    "C": ["Center"],
    "G-F": ["Guard", "Forward"],
    "F-C": ["Forward", "Center"],
    "C-F": ["Forward", "Center"],
    "F-G": ["Guard", "Forward"],
    "N/A": []
}

def get_player_general_positions(nba_position: str) -> list[str]:
    """Maps an NBA position string to a list of possible general fantasy positions."""
    return POSITION_MAPPING_RULES.get(nba_position, [])

def is_roster_valid(roster_players: list[models.Player]) -> bool:
    """
    Checks if a given list of players can form a valid roster according to MAX_POSITIONS.
    Uses a backtracking approach for flexible players.
    """
    temp_counts = {"Guard": 0, "Forward": 0, "Center": 0}
    flexible_players = []

    # First, count players with fixed (single) general positions
    for p in roster_players:
        possible_pos = get_player_general_positions(p.position)
        if len(possible_pos) == 1: # Fixed position player
            general_pos = possible_pos[0]
            temp_counts[general_pos] += 1
            if temp_counts[general_pos] > MAX_POSITIONS[general_pos]:
                return False # Exceeded limit with fixed players alone
        elif len(possible_pos) > 1: # Hybrid position player
            flexible_players.append(p)
        else: # Unrecognized position
            return False

    # Now, try to assign flexible players using backtracking
    def solve_flexible_assignment(flex_idx):
        if flex_idx == len(flexible_players):
            return True # All flexible players assigned successfully

        player = flexible_players[flex_idx]
        for general_pos_option in get_player_general_positions(player.position):
            if temp_counts[general_pos_option] < MAX_POSITIONS[general_pos_option]:
                temp_counts[general_pos_option] += 1 # Try assigning player to this slot
                if solve_flexible_assignment(flex_idx + 1):
                    return True
                temp_counts[general_pos_option] -= 1 # Backtrack: undo assignment

        return False

    return solve_flexible_assignment(0)


@app.post("/me/team/players/{player_id}", response_model=schemas.Player)
def add_player_to_team(
    player_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Dodaje jednego zawodnika do drużyny użytkownika, z walidacją pozycji."""
    # Sprawdzenie, czy drużyna nie jest pełna
    if len(current_user.players) >= MAX_TOTAL_PLAYERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Your team is full. You can have a maximum of {MAX_TOTAL_PLAYERS} players."
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
    
    # --- Roster Position Validation ---
    # Create a hypothetical roster including the new player
    hypothetical_roster = current_user.players + [player]

    if not is_roster_valid(hypothetical_roster):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Adding {player.full_name} would violate roster position limits."
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


@app.get("/leaderboard", response_model=list[schemas.User])
def get_leaderboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Returns a list of all users sorted by their total fantasy points in descending order.
    Accessible to any authenticated user.
    """
    users = db.query(models.User).order_by(models.User.total_fantasy_points.desc()).all()
    return users

# --- Admin Endpoints ---

@app.get("/admin/users", response_model=list[schemas.User])
def admin_get_all_users(
    db: Session = Depends(get_db), 
    current_admin: models.User = Depends(auth.get_current_active_admin)
):
    """[Admin only] Pobiera listę wszystkich użytkowników."""
    return db.query(models.User).all()

@app.delete("/admin/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(auth.get_current_active_admin)
):
    """[Admin only] Usuwa użytkownika o podanym ID."""
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot delete themselves."
        )
    
    user_to_delete = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
        
    db.delete(user_to_delete)
    db.commit()
    return

@app.put("/admin/users/{user_id}/reset-password", response_model=schemas.User)
def admin_reset_user_password(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(auth.get_current_active_admin)
):
    """[Admin only] Resetuje hasło użytkownika do wartości domyślnej."""
    user_to_reset = db.query(models.User).filter(models.User.id == user_id).first()
    if not user_to_reset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    
    # Ustawienie nowego, zahashowanego hasła. W praktyce można by wygenerować losowe.
    new_password = "newpassword" # Hasło domyślne
    user_to_reset.hashed_password = auth.get_password_hash(new_password)
    db.commit()
    db.refresh(user_to_reset)
    return user_to_reset


@app.post("/admin/sync-players", status_code=status.HTTP_200_OK)
async def sync_players_data(
    current_admin: models.User = Depends(auth.get_current_active_admin)
):
    """[Admin only] Triggers a full sync of NBA players and updates their stats."""
    print("Manual sync triggered by admin.")
    from scripts.fetch_nba_players import sync_all_players_from_api
    sync_all_players_from_api()
    update_stats_for_active_players()
    return {"message": "Player data sync initiated. Check server logs for progress."}


# --- Scheduler Logic ---

def run_stats_update():
    """
    A wrapper function for the scheduled job to ensure logging and error handling.
    """
    print("Scheduler: Triggered stats update job...")
    try:
        update_stats_for_active_players()
        print("Scheduler: Stats update job finished successfully.")
    except Exception as e:
        print(f"Scheduler: An error occurred during the stats update job: {e}")

# Create a scheduler
scheduler = BackgroundScheduler()

# Schedule the job to run every day at 3:00 AM
scheduler.add_job(run_stats_update, 'cron', hour=9, minute=0)

# Start the scheduler
scheduler.start()

# Register a shutdown function to be called when the application exits
atexit.register(lambda: scheduler.shutdown())
