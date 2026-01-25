import React from "react";
import { useAuth } from "../AuthContext";
import { removePlayerFromTeam } from "../services/api";
import { PlayerCard } from "../components/PlayerCard";
import { Box, Typography, CircularProgress } from '@mui/material'; // Import Material-UI components

export const MyTeamPage = () => {
  const { token, user, login } = useAuth(); // Get user and login (for refresh) from context

  const handleRemoveFromTeam = async (playerId: number) => {
    if (!token) return;

    try {
      await removePlayerFromTeam(token, playerId);
      // Refresh the user data in the context to reflect the change in team and total points
      await login(token); 
    } catch (error) {
      alert("Failed to remove player from your team. Please try again.");
    }
  };
  
  if (!user) {
    return (
      <Box className="flex justify-center items-center h-full">
        <CircularProgress />
        <Typography variant="h6" className="ml-4">Loading user data...</Typography>
      </Box>
    );
  }

  const playersInTeam = user.players || [];

  return (
    <Box className="p-4"> {/* Main container with padding */}
      <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl text-white"> {/* Themed header box */}
        <Typography variant="h5" component="h2" className="mb-2 sm:mb-0">
          My Team
        </Typography>
        <Typography variant="body1">
          Twoje całkowite punkty fantasy: {user.total_fantasy_points.toFixed(2)}
        </Typography>
      </Box>

      {playersInTeam.length === 0 ? (
        <Typography variant="body1" className="text-center mt-8">
          You haven't selected any players yet. Go to the Players page to build
          your team!
        </Typography>
      ) : (
        <Box className="flex flex-wrap justify-center gap-4 mt-8"> {/* Flex container for player cards with gap */}
          {playersInTeam.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onAddToTeam={() => {}}
              onRemoveFromTeam={() => handleRemoveFromTeam(player.id)}
              isInTeam={true}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyTeamPage;
