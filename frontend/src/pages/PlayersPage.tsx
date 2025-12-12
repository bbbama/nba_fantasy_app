import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../AuthContext";
import { getPlayers, getMyTeam, addPlayerToTeam, removePlayerFromTeam } from "../services/api";
import { Player } from "../types";
import { PlayerCard } from "../components/PlayerCard";

const playerListStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  padding: "20px",
};

const topBarStyle: React.CSSProperties = {
  padding: "10px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#f0f0f0",
};

export const PlayersPage = () => {
  const { token } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamPlayerIds, setTeamPlayerIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [allPlayers, myTeam] = await Promise.all([
          getPlayers(token),
          getMyTeam(token),
        ]);
        setPlayers(allPlayers);
        setTeamPlayerIds(new Set(myTeam.map((p: Player) => p.id)));
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token]);

  const handleAddToTeam = async (playerId: number) => {
    if (!token) return;
    if (teamPlayerIds.size >= 10) {
      alert("You can select a maximum of 10 players.");
      return;
    }
    
    // Optimistic UI update
    setTeamPlayerIds((prev) => new Set(prev).add(playerId));

    try {
      await addPlayerToTeam(token, playerId);
    } catch (error) {
      alert("Failed to add player to your team. Please try again.");
      // Revert UI on failure
      setTeamPlayerIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(playerId);
        return newSet;
      });
    }
  };

  const handleRemoveFromTeam = async (playerId: number) => {
    if (!token) return;

    // Optimistic UI update
    setTeamPlayerIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(playerId);
      return newSet;
    });

    try {
      await removePlayerFromTeam(token, playerId);
    } catch (error) {
      alert("Failed to remove player from your team. Please try again.");
      // Revert UI on failure
      setTeamPlayerIds((prev) => new Set(prev).add(playerId));
    }
  };

  if (loading) {
    return <div>Loading players...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div>
      <div style={topBarStyle}>
        <h2>Available Players ({teamPlayerIds.size} / 10 selected)</h2>
      </div>
      {players.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <div style={playerListStyle}>
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onAddToTeam={() => handleAddToTeam(player.id)}
              onRemoveFromTeam={() => handleRemoveFromTeam(player.id)}
              isInTeam={teamPlayerIds.has(player.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayersPage;
