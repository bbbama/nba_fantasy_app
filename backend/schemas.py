from pydantic import BaseModel
from typing import List, Optional

# Schematy dla Zawodnika (Player)
class PlayerBase(BaseModel):
    full_name: str
    position: Optional[str] = None
    team_name: Optional[str] = None
    average_fantasy_points: float = 0.0

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int

    class Config:
        from_attributes = True

# Schematy dla Użytkownika (User)
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    players: List[Player] = []

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

# Schematy dla Tokena (JWT)
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Schemat do aktualizacji drużyny użytkownika
class UserTeamUpdate(BaseModel):
    player_ids: List[int]
