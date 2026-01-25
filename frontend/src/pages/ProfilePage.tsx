import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { changePassword } from '../services/api';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material'; // Import Material-UI components

const ProfilePage = () => {
    const { token } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // New loading state

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true); // Set loading true

        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            setLoading(false);
            return;
        }

        if (!token) {
            setError("You are not authenticated.");
            setLoading(false);
            return;
        }

        try {
            await changePassword(token, {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_new_password: confirmNewPassword
            });
            setMessage("Password changed successfully!");
            // Clear fields after success
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Failed to change password. Please try again.");
            }
        } finally {
            setLoading(false); // Set loading false
        }
    };

    return (
        <Box className="p-4"> {/* Main container with padding */}
            <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg shadow-xl text-white"> {/* Themed header box */}
                <Typography variant="h5" component="h2" className="mb-2 sm:mb-0">
                    My Profile
                </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 4, mt: 4, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Change Password
                </Typography>

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="newPassword"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="confirmNewPassword"
                    label="Confirm New Password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading} // Disable button when loading
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                </Button>

                {message && <Typography variant="body1" color="success" sx={{ mt: 2 }}>{message}</Typography>}
                {error && <Typography variant="body1" color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </Box>
        </Box>
    );
};

export default ProfilePage;
