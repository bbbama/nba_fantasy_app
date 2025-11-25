from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "sqlite:///./nba_fantasy.db"

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
    position = Column(String)
    team_name = Column(String)
    points = Column(Integer, default=0)
    rebounds = Column(Integer, default=0)
    assists = Column(Integer, default=0)

    # Relacja zwrotna do użytkowników, którzy mają tego gracza w drużynie
    users = relationship(
        "User",
        secondary=user_player_association,
        back_populates="players"
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
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    # Ten blok zostanie wykonany, gdy skrypt będzie uruchamiany bezpośrednio
    # i utworzy tabele w bazie danych.
    print("Creating database tables...")
    create_tables()
    print("Tables created successfully.")
