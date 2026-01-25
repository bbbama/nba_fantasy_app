from __future__ import annotations # Required for Pydantic forward references
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
    nickname: Optional[str] = None

class UserCreate(UserBase):
    password: str

# Lżejsza wersja Usera dla zagnieżdżonych struktur (np. w League)
class UserInLeague(UserBase):
    id: int
    role: str
    total_fantasy_points: float # Added total_fantasy_points

    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    role: str
    total_fantasy_points: float
    players: List[Player] = []
    leagues: List['League'] = [] # Forward reference - will be updated after League definition

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

class UserUpdate(BaseModel):
    nickname: Optional[str] = None

# Schematy dla Lig (League)
class LeagueBase(BaseModel):
    name: str

class LeagueCreate(LeagueBase):
    pass

class League(LeagueBase):
    id: int
    owner_id: int
    invite_code: str
    users: List[UserInLeague] = [] # Use lighter UserInLeague to break recursion

    class Config:
        from_attributes = True

User.model_rebuild() # Resolve forward reference for 'leagues' in User schema

# Schematy dla Tokena (JWT)
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Schemat do aktualizacji drużyny użytkownika
class UserTeamUpdate(BaseModel):
    player_ids: List[int]
