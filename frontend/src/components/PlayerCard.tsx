import React from "react";
import { Player } from "../types";
import { Card, CardContent, Typography, Button, Box } from '@mui/material'; // Import Material-UI components

interface PlayerCardProps {
  player: Player;
  onAddToTeam: (playerId: number) => void;
  onRemoveFromTeam: (playerId: number) => void;
  isInTeam: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onAddToTeam,
  onRemoveFromTeam,
  isInTeam,
}) => {
  return (
    <Card className="m-2 w-52 shadow-lg relative"> {/* Tailwind for margin, width, shadow, relative positioning */}
      {isInTeam && (
        <Box className="absolute top-2 right-2 bg-yellow-400 rounded-full w-5 h-5 flex justify-center items-center text-xs font-bold">
          ★
        </Box>
      )}
      <CardContent>
        <Typography variant="h6" component="div" className="text-base font-bold mb-2"> {/* Tailwind for font size, weight, margin */}
          {player.full_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="text-sm mb-3"> {/* Tailwind for font size, margin */}
          <p>Position: {player.position || "N/A"}</p>
          <p>Team: {player.team_name || "N/A"}</p>
          <p>Avg. Fantasy Points: {player.average_fantasy_points.toFixed(2)}</p>
          <p>Last Game FP: {player.last_game_fantasy_points !== null ? player.last_game_fantasy_points.toFixed(2) : "N/A"}</p>
        </Typography>
        {isInTeam ? (
          <Button
            variant="contained"
            color="error" // Material-UI color
            size="small"
            fullWidth
            onClick={() => onRemoveFromTeam(player.id)}
            className="mt-2" // Tailwind for top margin
          >
            Remove from Team
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary" // Material-UI color
            size="small"
            fullWidth
            onClick={() => onAddToTeam(player.id)}
            className="mt-2" // Tailwind for top margin
          >
            Add to Team
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

