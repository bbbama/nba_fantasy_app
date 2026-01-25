import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { changePassword, updateUserProfile } from '../services/api'; // Import updateUserProfile
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material'; // Import Material-UI components
import { useSnackbar } from '../SnackbarContext'; // Import useSnackbar
import { useEffect } from 'react'; // Import useEffect

const ProfilePage = () => {
    const { token, user, refreshUserData } = useAuth(); // Also get user and refreshUserData
    const { showSnackbar } = useSnackbar();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false); // New loading state for password change
    const [nickname, setNickname] = useState(user?.nickname || ''); // New nickname state
    const [loadingNickname, setLoadingNickname] = useState(false); // New loading state for nickname update

    useEffect(() => {
        if (user) {
            setNickname(user.nickname || '');
        }
    }, [user]);

    const handleNicknameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingNickname(true);
        if (!token) {
            showSnackbar("You are not authenticated.", 'error');
            setLoadingNickname(false);
            return;
        }
        if (nickname === user?.nickname) {
            showSnackbar("Nickname is already up to date.", 'info');
            setLoadingNickname(false);
            return;
        }

        try {
            await updateUserProfile(token, { nickname });
            showSnackbar("Nickname updated successfully!", 'success');
            await refreshUserData(); // Refresh user data in context
        } catch (err: any) {
            showSnackbar(err.response?.data?.detail || "Failed to update nickname. Please try again.", 'error');
        } finally {
            setLoadingNickname(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Remove error and message state usage as Snackbar handles it
        setLoading(true); // Set loading true

        if (newPassword !== confirmNewPassword) {
            showSnackbar("New passwords do not match.", 'error'); // Use showSnackbar
            setLoading(false);
            return;
        }

        if (!token) {
            showSnackbar("You are not authenticated.", 'error'); // Use showSnackbar
            setLoading(false);
            return;
        }

        try {
            await changePassword(token, {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_new_password: confirmNewPassword
            });
            showSnackbar("Password changed successfully!", 'success'); // Use showSnackbar
            // Clear fields after success
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            showSnackbar(err.response?.data?.detail || "Failed to change password. Please try again.", 'error'); // Use showSnackbar
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

            {/* Nickname Update Section */}
            <Box component="form" onSubmit={handleNicknameSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 4, mt: 4, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 3 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Update Nickname
                </Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    id="nickname"
                    label="Nickname"
                    name="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loadingNickname}
                >
                    {loadingNickname ? <CircularProgress size={24} color="inherit" /> : 'Save Nickname'}
                </Button>
            </Box>

            {/* Change Password Section */}
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
            </Box>
        </Box>
    );
};

export default ProfilePage;
