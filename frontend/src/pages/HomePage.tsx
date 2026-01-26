import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { useAuth } from '../AuthContext';
import { Link } from "react-router-dom"; // Import Link for navigation
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Paper } from '@mui/material'; // Import Material-UI components
import { getDailyFantasyPoints } from '../services/api'; // Import getDailyFantasyPoints
import { useSnackbar } from '../SnackbarContext'; // Import useSnackbar

// Define an interface for the daily points data, mirroring backend schema
interface PlayerDailyPoints {
  player_name: string;
  points: number;
}

interface DailyFantasyPoints {
  total_today_points: number;
  player_points_breakdown: PlayerDailyPoints[];
}

export const HomePage = () => {
  const { user, isAuthenticated, logout, token } = useAuth(); // Also get token from useAuth
  const { showSnackbar } = useSnackbar();

  const [dailyPoints, setDailyPoints] = useState<DailyFantasyPoints | null>(null);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [dailyError, setDailyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyData = async () => {
      if (!token) {
        setDailyError("No authentication token found.");
        setDailyLoading(false);
        return;
      }
      if (!isAuthenticated) {
        setDailyLoading(false);
        return;
      }
      try {
        setDailyLoading(true);
        const data = await getDailyFantasyPoints(token);
        setDailyPoints(data);
      } catch (err: any) {
        setDailyError("Failed to fetch daily fantasy points.");
        showSnackbar(err.response?.data?.detail || "Failed to fetch daily fantasy points.", 'error');
      } finally {
        setDailyLoading(false);
      }
    };

    fetchDailyData();
  }, [token, isAuthenticated, showSnackbar]);

  return (
    <Box className="p-4"> {/* Main container with padding */}
      <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl text-white"> {/* Themed header box */}
        <Typography variant="h5" component="h1" className="mb-2 sm:mb-0">
          Witaj w NBA Fantasy!
        </Typography>
      </Box>

      {isAuthenticated && user ? (
        <>
          {/* Welcome Section for Authenticated User */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
            <Typography variant="h5" component="h2" className="mb-2 sm:mb-0" gutterBottom>
              Welcome, {user.nickname || 'User'}!
            </Typography>
            <Typography variant="body1">Twoje całkowite punkty fantasy: {user.total_fantasy_points.toFixed(2)}</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={logout}
              sx={{ mt: 3 }}
            >
              Wyloguj się
            </Button>
          </Box>

          {/* Today's Fantasy Points Section */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Today's Fantasy Points</Typography>
            {dailyLoading ? (
              <Box className="flex justify-center items-center">
                <CircularProgress size={20} />
                <Typography variant="body2" className="ml-2">Loading today's points...</Typography>
              </Box>
            ) : dailyError ? (
              <Typography variant="body1" color="error">{dailyError}</Typography>
            ) : dailyPoints && dailyPoints.player_points_breakdown.length > 0 ? (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Total today: <span style={{ color: '#C8102E', fontWeight: 'bold' }}>{dailyPoints.total_today_points.toFixed(2)}</span> FP
                </Typography>
                <Typography variant="body2" gutterBottom>Player Breakdown:</Typography>
                <List dense>
                  {dailyPoints.player_points_breakdown.map((playerStats, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText primary={<Typography variant="body2">{playerStats.player_name}: {playerStats.points.toFixed(2)} FP</Typography>} />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Typography variant="body1">No player game stats found for today or no players in your team.</Typography>
            )}
          </Box>

          {/* Your Team Overview Section */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Your Team Overview</Typography>
            {user.players && user.players.length > 0 ? (
              <>
                <Typography variant="body1">Total players in your team: {user.players.length}</Typography>
                <Typography variant="body1">Total Fantasy Points: {user.total_fantasy_points.toFixed(2)}</Typography>
                {/* You could add more detailed team overview here, e.g., list of players */}
              </>
            ) : (
              <Typography variant="body1">You haven't selected any players yet. Go to the Players page to build your team!</Typography>
            )}
          </Box>

          {/* Quick Navigation Section */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Navigation</Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button variant="contained" color="primary" component={Link} to="/players">View Players</Button>
                        <Button variant="contained" color="primary" component={Link} to="/my-team">Manage My Team</Button> {/* Changed color to primary */}
                        <Button variant="contained" color="primary" component={Link} to="/leaderboard">Leaderboard</Button> {/* Changed variant to contained */}
                      </Box>          </Box>
        </>
      ) : (
        <Box sx={{ maxWidth: 500, mx: 'auto', p: 4, mt: 4, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Proszę się zalogować, aby zobaczyć swoją stronę główną.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="primary" component={Link} to="/login">Zaloguj się</Button>
            <Button variant="outlined" color="secondary" component={Link} to="/register">Zarejestruj się</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
