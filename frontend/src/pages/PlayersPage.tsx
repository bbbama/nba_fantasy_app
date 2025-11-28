import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { getPlayers } from "../services/api";
import { Player } from "../types";
import { PlayerCard } from "../components/PlayerCard";

const playerListStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  padding: "20px",
};

export const PlayersPage = () => {
  const { token } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }
      try {
        const data = await getPlayers(token);
        setPlayers(data);
      } catch (err) {
        let errorMessage = "Failed to fetch players.";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof err.response === "object" &&
          err.response !== null &&
          "data" in err.response &&
          typeof err.response.data === "object" &&
          err.response.data !== null &&
          "detail" in err.response.data
        ) {
          errorMessage = (err.response.data as { detail: string }).detail;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [token]);

  if (loading) {
    return <div>Loading players...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Available Players</h2>
      {players.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <div style={playerListStyle}>
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayersPage;
