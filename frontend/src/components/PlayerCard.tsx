import React from "react";
import { Player } from "../types";
import { Card, CardContent, Typography, Button, Box, Divider } from '@mui/material'; // Import Material-UI components

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
          <Card
            className="m-2 w-52 shadow-lg relative text-white"
            sx={{
              bgcolor: 'background.paper', // Use theme's paper background
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px 0 rgba(0,0,0,0.4)',
              },
            }}
          >
            {isInTeam && (
              <Box className="absolute top-2 right-2 rounded-full w-5 h-5 flex justify-center items-center text-xs font-bold" sx={{ bgcolor: 'secondary.main' }}>
                ★
              </Box>
            )}
            <CardContent>
              <Typography variant="h6" component="div" className="text-base font-bold mb-2">
                {player.full_name}
              </Typography>
              <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }} /> {/* Divider after name */}
              <Typography variant="body2" className="text-sm mb-3">
                <p>Position: {player.position || "N/A"}</p>
                <p>Team: {player.team_name || "N/A"}</p>
                <p>Avg. Fantasy Points: {player.average_fantasy_points.toFixed(2)}</p>
                <p>Last Game FP: {player.last_game_fantasy_points !== null ? player.last_game_fantasy_points.toFixed(2) : "N/A"}</p>
              </Typography>
              <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }} /> {/* Divider before buttons */}
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
          </Card>  );
};

