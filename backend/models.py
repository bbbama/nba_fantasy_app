import os
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table, Boolean, Float, UniqueConstraint
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Absolutna ścieżka do katalogu, w którym znajduje się ten plik
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Absolutna ścieżka do pliku bazy danych
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'data', 'nba_fantasy.db')}"

Base = declarative_base()

# Tabela asocjacyjna dla relacji wiele-do-wielu między User a Player
user_player_association = Table(
    'user_player_association', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('player_id', Integer, ForeignKey('players.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)  # Role: 'user' or 'admin'

    # Relacja do zawodników w drużynie użytkownika
    players = relationship(
        "Player",
        secondary=user_player_association,
        back_populates="users"
    )

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    is_active = Column(Boolean, nullable=False)
    position = Column(String)
    team_name = Column(String)
    
    # To pole będzie przechowywać średnią punktów fantasy
    average_fantasy_points = Column(Float, default=0.0)

    # Relacja zwrotna do użytkowników, którzy mają tego gracza w drużynie
    users = relationship(
        "User",
        secondary=user_player_association,
        back_populates="players"
    )
    
    # Relacja do statystyk z poszczególnych meczy
    game_stats = relationship("PlayerGameStats", back_populates="player", cascade="all, delete-orphan")

class PlayerGameStats(Base):
    __tablename__ = "player_game_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey('players.id'), nullable=False)
    game_id = Column(String, nullable=False) # Not unique by itself
    game_date = Column(String, nullable=False)
    
    points = Column(Integer, default=0)
    rebounds = Column(Integer, default=0)
    assists = Column(Integer, default=0)
    fantasy_points = Column(Float, default=0.0)
    
    player = relationship("Player", back_populates="game_stats")

    __table_args__ = (
        UniqueConstraint('player_id', 'game_id', name='_player_game_uc'),
    )


# Konfiguracja silnika bazy danych
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Sesja bazy danych
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    # Upewnij się, że folder 'data' istnieje
    data_dir = os.path.join(BASE_DIR, 'data')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    # Ten blok zostanie wykonany, gdy skrypt będzie uruchamiany bezpośrednio
    # i utworzy tabele w bazie danych.
    print("Creating database tables...")
    create_tables()
    print("Tables created successfully.")