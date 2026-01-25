export interface User {
  id: number;
  email: string;
  nickname?: string; // Optional nickname field
  role: string;
  total_fantasy_points: number;
  players: Player[]; // Dodano graczy do interfejsu User
}

export interface League {
  id: number;
  name: string;
  owner_id: number;
  invite_code: string;
  users: User[]; // List of users in the league
}

export interface Player {
  id: number;
  full_name: string;
  position: string | null;
  team_name: string | null;
  average_fantasy_points: number;
  last_game_fantasy_points: number | null;
}
