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
    last_game_fantasy_points: Optional[float] = None

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
    total_fantasy_points: float
    players: List[Player] = []

    class Config:
        from_attributes = True

class UserTeam(User):
    total_fantasy_points: float

class UserLogin(BaseModel):
    email: str
    password: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str

# Schematy dla Tokena (JWT)
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Schemat do aktualizacji drużyny użytkownika
class UserTeamUpdate(BaseModel):
    player_ids: List[int]
