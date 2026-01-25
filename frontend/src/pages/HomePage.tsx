import React from 'react';
import { useAuth } from '../AuthContext';
import { Link } from "react-router-dom"; // Import Link for navigation
import { Box, Typography, Button } from '@mui/material'; // Import Material-UI components

export const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Box className="p-4"> {/* Main container with padding */}
      <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl text-white"> {/* Themed header box */}
        <Typography variant="h5" component="h1" className="mb-2 sm:mb-0">
          Witaj w NBA Fantasy!
        </Typography>
      </Box>

      {isAuthenticated && user ? (
        <>
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
          <Typography variant="h5" component="h2" className="mb-2 sm:mb-0">
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
