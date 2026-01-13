import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { adminGetAllUsers, adminDeleteUser, adminResetUserPassword, adminSyncPlayersData } from "../services/api";
import { User } from "../types";

const AdminPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
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
  };

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
  }, [token]);


  const handleDeleteUser = async (userId: number) => {
    if (!token) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
        try {
            await adminDeleteUser(token, userId);
            // Refresh user list
            fetchUsers();
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
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Admin Panel - User Management</h2>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleSyncPlayers} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Sync Players Data
        </button>
      </div>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Total FP</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.total_fantasy_points.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleResetPassword(user.id)}>Reset Password</button>
                  <button onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
