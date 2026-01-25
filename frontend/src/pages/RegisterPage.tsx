import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api'; // Import registerUser
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material'; // Import Material-UI components

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true); // Set loading true

    try {
      await registerUser(email, password);
      setMessage('Rejestracja zakończona sukcesem! Możesz się teraz zalogować.');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response && typeof err.response.data === 'object' && err.response.data !== null && 'detail' in err.response.data) {
        errorMessage = (err.response.data as { detail: string }).detail;
      }
      console.error('Registration error:', errorMessage);
      setError(errorMessage);
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

        {error && <Typography variant="body1" color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {message && <Typography variant="body1" color="success" sx={{ mt: 2 }}>{message}</Typography>}

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Masz już konto? <Link to="/login" style={{ color: 'inherit' }}>Zaloguj się</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
