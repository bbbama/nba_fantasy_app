import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { changePassword } from '../services/api';

const ProfilePage = () => {
    const { token } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (!token) {
            setError("You are not authenticated.");
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
        }
    };

    return (
        <div>
            <h2>My Profile</h2>
            <form onSubmit={handleSubmit}>
                <h3>Change Password</h3>
                <div>
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Change Password</button>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default ProfilePage;
