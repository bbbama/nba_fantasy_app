import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getLeagueDetails } from "../services/api";
import { League } from "../types";
import { Box, Typography, CircularProgress, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useSnackbar } from '../SnackbarContext';

export const LeagueDetailsPage = () => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { token, user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeague = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
      if (!leagueId) {
        setError("League ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data: League = await getLeagueDetails(token, parseInt(leagueId));
        setLeague(data);
      } catch (err: any) {
        setError("Failed to fetch league details.");
        showSnackbar(err.response?.data?.detail || "Failed to fetch league details.", 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLeague();
  }, [token, leagueId]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-full">
        <CircularProgress />
        <Typography variant="h6" className="ml-4">Loading league details...</Typography>
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

  if (!league) {
    return (
        <Box className="flex justify-center items-center h-full">
            <Typography variant="h6">League not found.</Typography>
        </Box>
    );
  }

  return (
    <Box className="p-4">
      <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl text-white">
        <Typography variant="h5" component="h2" className="mb-2 sm:mb-0">
          League: {league.name}
        </Typography>
        <Typography variant="body1">
          Owner: {league.users.find(u => u.id === league?.owner_id)?.nickname || league.users.find(u => u.id === league?.owner_id)?.email || 'N/A'}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3, mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>Invite Code: <span style={{ color: '#C8102E', fontWeight: 'bold' }}>{league.invite_code}</span></Typography>
      </Paper>

      <Paper elevation={3} sx={{ bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ p: 2, pb: 0 }} gutterBottom>Members</Typography>
        <List>
          {league.users.map((member) => (
            <ListItem key={member.id} divider>
                            <ListItemText
                              primary={<Typography variant="body1">{member.nickname || member.email}</Typography>}
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  Total Fantasy Points: {member.total_fantasy_points.toFixed(2)}
                                  {member.id === league.owner_id && <span style={{ marginLeft: '8px', color: '#002D62', fontWeight: 'bold' }}> (Owner)</span>}
                                </Typography>
                              }
                            />            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default LeagueDetailsPage;
