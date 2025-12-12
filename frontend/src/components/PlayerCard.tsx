import React from "react";
import { Player } from "../types";

interface PlayerCardProps {
  player: Player;
  onAddToTeam: (playerId: number) => void;
  onRemoveFromTeam: (playerId: number) => void;
  isInTeam: boolean;
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  margin: "8px",
  width: "200px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f9f9f9",
  position: "relative",
};

const playerNameStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "8px",
};

const playerDetailsStyle: React.CSSProperties = {
  fontSize: "14px",
  marginBottom: "12px",
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};

const addButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#28a745",
  color: "white",
};

const removeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#dc3545",
  color: "white",
};

const inTeamIndicatorStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "gold",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "12px",
  fontWeight: "bold",
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onAddToTeam,
  onRemoveFromTeam,
  isInTeam,
}) => {
  return (
    <div style={cardStyle}>
      {isInTeam && <div style={inTeamIndicatorStyle}>★</div>}
      <div style={playerNameStyle}>{player.full_name}</div>
      <div style={playerDetailsStyle}>
        <p>Position: {player.position || "N/A"}</p>
        <p>Team: {player.team_name || "N/A"}</p>
        <p>Avg. Fantasy Points: {player.average_fantasy_points.toFixed(2)}</p>
      </div>
      {isInTeam ? (
        <button
          style={removeButtonStyle}
          onClick={() => onRemoveFromTeam(player.id)}
        >
          Remove from Team
        </button>
      ) : (
        <button
          style={addButtonStyle}
          onClick={() => onAddToTeam(player.id)}
        >
          Add to Team
        </button>
      )}
    </div>
  );
};

