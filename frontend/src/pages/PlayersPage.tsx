import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getPlayers, addPlayerToTeam, removePlayerFromTeam } from "../services/api";
import { Player } from "../types";
import { PlayerCard } from "../components/PlayerCard";
import { Box, Typography, TextField, CircularProgress, InputAdornment } from '@mui/material'; // Import Material-UI components
import SearchIcon from '@mui/icons-material/Search';

export const PlayersPage = () => {
  const { token, user, login } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // New state for search term

  const teamPlayerIds = new Set(user?.players.map((p) => p.id) || []);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const allPlayers = await getPlayers(token);
        setPlayers(allPlayers);
      } catch (err) {
        setError("Failed to fetch players.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [token]);

  const handleAddToTeam = async (playerId: number) => {
    if (!token) return;
    try {
      await addPlayerToTeam(token, playerId);
      await login(token);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Failed to add player to your team. Please try again.");
      }
    }
  };

  const handleRemoveFromTeam = async (playerId: number) => {
    if (!token) return;
    try {
      await removePlayerFromTeam(token, playerId);
      await login(token);
    } catch (error) {
      alert("Failed to remove player from your team. Please try again.");
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPlayers = players.filter((player) =>
    player.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-full">
        <CircularProgress />
        <Typography variant="h6" className="ml-4">Loading players...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-full text-red-500">
        <Typography variant="h6">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4"> {/* Main container with padding */}
      <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl"> {/* Top bar with flex layout */}
        <Typography variant="h5" component="h2" className="mb-2 sm:mb-0">
          Available Players ({teamPlayerIds.size} / 10 selected)
        </Typography>
        <TextField
          label="Search Players"
          variant="outlined"
          size="medium" // Making it slightly larger for visibility
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full sm:w-1/3" // Tailwind for width
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '.MuiInputLabel-root': { color: 'white' }, // Ensure label is white
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, // Ensure border is white
            '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
            '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }, // Focus color
            '.MuiInputBase-input': { color: 'white' }, // Input text color
            '.MuiSvgIcon-root': { color: 'white' }, // Search icon color
          }}
        />
      </Box>
      {filteredPlayers.length === 0 ? (
        <Typography variant="body1" className="text-center mt-8">
          No players found matching your criteria.
        </Typography>
      ) : (
        <Box className="flex flex-wrap justify-center gap-4"> {/* Flex container for player cards with gap */}
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onAddToTeam={() => handleAddToTeam(player.id)}
              onRemoveFromTeam={() => handleRemoveFromTeam(player.id)}
              isInTeam={teamPlayerIds.has(player.id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PlayersPage;
