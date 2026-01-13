import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { PlayersPage } from "./pages/PlayersPage";
import { MyTeamPage } from "./pages/MyTeamPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import { PrivateRoute } from "./components/PrivateRoute";
import { AdminRoute } from "./components/AdminRoute";
import Layout from './components/Layout'; // Importujemy nasz nowy komponent Layout
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'; // Importujemy dodatkowe komponenty MUI

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <Layout> {/* Cała aplikacja opakowana w Layout */}
      <AppBar position="static" className="bg-blue-600">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="text-white">
            NBA Fantasy
          </Typography>
          <Button color="inherit" component={Link} to="/" className="text-white">Home</Button>
          {!isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/login" className="text-white">Login</Button>
              <Button color="inherit" component={Link} to="/register" className="text-white">Register</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/players" className="text-white">Players</Button>
              <Button color="inherit" component={Link} to="/my-team" className="text-white">My Team</Button>
              <Button color="inherit" component={Link} to="/leaderboard" className="text-white">Leaderboard</Button>
              <Button color="inherit" component={Link} to="/profile" className="text-white">My Profile</Button>
              {user?.role === 'admin' && (
                <Button color="inherit" component={Link} to="/admin" className="text-white">Admin Panel</Button>
              )}
              <Button color="inherit" onClick={logout} className="text-white">Logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box className="p-4"> {/* Box dla zawartości routingu */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/players"
            element={
              <PrivateRoute>
                <PlayersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-team"
            element={
              <PrivateRoute>
                <MyTeamPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <LeaderboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </Box>
    </Layout>
  );
}

export default App;