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
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage
import { PrivateRoute } from "./components/PrivateRoute";
import { AdminRoute } from "./components/AdminRoute";

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/players">Players</Link>
              </li>
              <li>
                <Link to="/my-team">My Team</Link>
              </li>
              <li>
                <Link to="/leaderboard">Leaderboard</Link>
              </li>
              <li>
                <Link to="/profile">My Profile</Link>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <Link to="/admin">Admin Panel</Link>
                </li>
              )}
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <hr />
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
    </div>
  );
}

export default App;