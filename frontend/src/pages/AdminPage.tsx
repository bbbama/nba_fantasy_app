import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../AuthContext";
import { adminGetAllUsers, adminDeleteUser, adminResetUserPassword, adminSyncPlayersData } from "../services/api";
import { User } from "../types";
import { Box, Typography, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';

const AdminPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ESLint fix: fetchUsers moved inside useEffect or wrapped with useCallback
  const fetchUsers = useCallback(async () => {
    if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
    }
    try {
        setLoading(true);
        const data = await adminGetAllUsers(token);
        setUsers(data);
    } catch (err) {
        setError("Failed to fetch users.");
        console.error("Failed to fetch users:", err);
    } finally {
        setLoading(false);
    }
  }, [token]); // token is a dependency of fetchUsers


  const handleSyncPlayers = async () => {
    if (!token) return;
    if (window.confirm("Are you sure you want to trigger a full player data sync? This might take a moment.")) {
      try {
        const response = await adminSyncPlayersData(token);
        alert(response.message);
      } catch (err) {
        alert("Failed to trigger player data sync.");
        console.error("Failed to trigger player data sync:", err);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // fetchUsers is now a dependency because it's wrapped in useCallback


  const handleDeleteUser = async (userId: number) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
        try {
            await adminDeleteUser(token, userId);
            fetchUsers(); // Refresh user list after deletion
        } catch (err) {
            alert("Failed to delete user.");
        }
    }
  };

  const handleResetPassword = async (userId: number) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to reset this user's password?")) {
        try {
            await adminResetUserPassword(token, userId);
            alert("User password has been reset to 'newpassword'.");
        } catch (err) {
            alert("Failed to reset password.");
          }
      }
    };

    if (loading) {
      return (
        <Box className="flex justify-center items-center h-full"> {/* Changed h-screen to h-full */}
          <CircularProgress />
          <Typography variant="h6" className="ml-4">Loading users...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box className="flex justify-center items-center h-full"> {/* Changed h-screen to h-full */}
          <Typography variant="h6" color="error">Error: {error}</Typography>
        </Box>
      );
    }

    return (
      <Box className="p-4">
        <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl text-white"> {/* Themed header box */}
          <Typography variant="h5" component="h2" className="mb-2 sm:mb-0">
            Admin Panel - User Management
          </Typography>
        </Box>

        <Box className="mb-6">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSyncPlayers}
          >
            Sync Players Data
          </Button>
        </Box>

        {users.length === 0 ? (
          <Typography variant="body1" className="text-center mt-8">No users found.</Typography>
        ) : (
          <Paper elevation={3} sx={{ bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}> {/* Apply themed background to Paper */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Total FP</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell sx={{ color: 'text.primary' }}>{user.id}</TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{user.email}</TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{user.role}</TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>{user.total_fantasy_points.toFixed(2)}</TableCell>
                      <TableCell>
                                              <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleResetPassword(user.id)}
                                                className="mr-2"
                                              >
                                                Reset Password
                                              </Button>
                                              <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteUser(user.id)}
                                              >
                                                Delete
                                              </Button>
                                          </TableCell>
                                        </TableRow>                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    );
  };

  export default AdminPage;