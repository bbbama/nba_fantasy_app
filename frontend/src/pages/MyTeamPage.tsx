import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getMyTeam, removePlayerFromTeam } from "../services/api";
import { Player } from "../types";
import { PlayerCard } from "../components/PlayerCard";

const teamListStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  padding: "20px",
};

export const MyTeamPage = () => {
  const { token } = useAuth();
  const [team, setTeam] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
      try {
        const data = await getMyTeam(token);
        setTeam(data);
      } catch (err) {
        setError("Failed to fetch your team.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [token]);

  const handleRemoveFromTeam = async (playerId: number) => {
    if (!token) return;

    // Optimistic UI update: remove player from state immediately
    const originalTeam = [...team];
    setTeam(currentTeam => currentTeam.filter(player => player.id !== playerId));

    try {
      await removePlayerFromTeam(token, playerId);
    } catch (error) {
      alert("Failed to remove player from your team. Please try again.");
      // Revert UI on failure
      setTeam(originalTeam);
    }
  };

  if (loading) {
    return <div>Loading your team...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>My Team</h2>
      {team.length === 0 ? (
        <p>You haven't selected any players yet. Go to the Players page to build your team!</p>
      ) : (
        <div style={teamListStyle}>
          {team.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onAddToTeam={() => {}} // Not applicable on this page
              onRemoveFromTeam={() => handleRemoveFromTeam(player.id)}
              isInTeam={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeamPage;
