import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // Import loginUser
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material'; // Import Material-UI components
import { useSnackbar } from '../SnackbarContext'; // Import useSnackbar

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar(); // Use useSnackbar hook

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading true

    try {
      const data = await loginUser(email, password);
      await login(data.access_token); // Await the login process
      showSnackbar('Login successful!', 'success'); // Show success message
      navigate("/");
    } catch (err: any) { // Type err as any for easier access to response properties
      let errorMessage = "An unknown error occurred.";
      if (err.response && err.response.data && err.response.data.detail) {
        errorMessage = err.response.data.detail; // Prioritize backend detail message
      } else if (err instanceof Error) {
        errorMessage = err.message; // Fallback to generic error message
      }
      console.error("Login error:", errorMessage);
      showSnackbar(errorMessage, 'error'); // Show error message
    } finally {
      setLoading(false); // Set loading false
    }
  };

  return (
    <Box className="p-4"> {/* Main container with padding */}
      <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl text-white"> {/* Themed header box */}
        <Typography variant="h5" component="h2" className="mb-2 sm:mb-0">
          Logowanie
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 4, mt: 4, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Zaloguj się do swojego konta
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
          autoComplete="current-password"
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Zaloguj'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
