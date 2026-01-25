import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getLeaderboard } from "../services/api";
import { User } from "../types";
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'; // Import Material-UI components

const LeaderboardPage = () => {
  const { token } = useAuth();
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getLeaderboard(token);
        setLeaderboard(data);
      } catch (err) {
        setError("Failed to fetch leaderboard data.");
        console.error("Failed to fetch leaderboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-full">
        <CircularProgress />
        <Typography variant="h6" className="ml-4">Loading leaderboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-full">
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4"> {/* Main container with padding */}
      <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl text-white"> {/* Themed header box */}
        <Typography variant="h5" component="h2" className="mb-2 sm:mb-0">
          Leaderboard
        </Typography>
      </Box>

              {leaderboard.length === 0 ? (
                <Typography variant="body1" className="text-center mt-8">
                  No users found in the leaderboard.
                </Typography>
              ) : (
                <TableContainer component={Paper} sx={{ mt: 3, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
                  <Table aria-label="leaderboard table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Rank</TableCell>
                        <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>User</TableCell>
                        <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Fantasy Points</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaderboard.map((user, index) => (
                        <TableRow key={user.id}>
                          <TableCell component="th" scope="row" sx={{ color: 'text.secondary' }}>
                            {index + 1}
                          </TableCell>
                          <TableCell sx={{ color: 'text.primary' }}>{user.nickname || user.email}</TableCell>
                          <TableCell align="right" sx={{ color: 'text.primary' }}>{user.total_fantasy_points.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          );
        };
export default LeaderboardPage;