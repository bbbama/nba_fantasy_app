import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getLeaderboard } from "../services/api";
import { User } from "../types";

const LeaderboardPage = () => {
  const { token } = useAuth();
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getLeaderboard(token);
        setLeaderboard(data);
      } catch (err) {
        setError("Failed to fetch leaderboard data.");
        console.error("Failed to fetch leaderboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token]);

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No users found in the leaderboard.</p>
      ) : (
        <ol>
          {leaderboard.map((user, index) => (
            <li key={user.id}>
              {index + 1}. {user.email} - {user.total_fantasy_points.toFixed(2)} FP
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default LeaderboardPage;