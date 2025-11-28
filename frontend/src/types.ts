export interface Player {
    id: number;
    full_name: string;
    position: string | null;
    team_name: string | null;
    points: number;
    rebounds: number;
    assists: number;
}