import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api'; // Import registerUser
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material'; // Import Material-UI components
import { useSnackbar } from '../SnackbarContext'; // Import useSnackbar

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(''); // New nickname state
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar(); // Use useSnackbar hook

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading true

    try {
      await registerUser(email, password, nickname);
      showSnackbar('Registration successful! You can now log in.', 'success'); // Show success message
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err: any) { // Type err as any
      let errorMessage = 'An unknown error occurred.';
      if (err.response && err.response.data && err.response.data.detail) {
        errorMessage = err.response.data.detail; // Prioritize backend detail message
      } else if (err instanceof Error) {
        errorMessage = err.message; // Fallback to generic error message
      }
      console.error('Registration error:', errorMessage);
      showSnackbar(errorMessage, 'error'); // Show error message
    } finally {
      setLoading(false); // Set loading false
    }
  };

  return (
    <Box className="p-4"> {/* Main container with padding */}
      <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl text-white"> {/* Themed header box */}
        <Typography variant="h5" component="h2" className="mb-2 sm:mb-0">
          Rejestracja
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 4, mt: 4, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Utwórz nowe konto
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          id="nickname"
          label="Nickname (Optional)"
          name="nickname"
          autoComplete="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Zarejestruj'}
        </Button>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Masz już konto? <Link to="/login" style={{ color: 'inherit' }}>Zaloguj się</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
