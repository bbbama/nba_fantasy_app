from pydantic import BaseModel
from typing import List, Optional

# Schematy dla Zawodnika (Player)
class PlayerBase(BaseModel):
    full_name: str
    position: Optional[str] = None
    team_name: Optional[str] = None
    points: int = 0
    rebounds: int = 0
    assists: int = 0

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int

    class Config:
        orm_mode = True

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
        orm_mode = True

# Schematy dla Tokena (JWT)
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Schemat do aktualizacji drużyny użytkownika
class UserTeamUpdate(BaseModel):
    player_ids: List[int]
