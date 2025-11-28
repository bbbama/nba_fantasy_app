import React from "react";
import { Player } from "../types";

interface PlayerCardProps {
    player: Player;
}

const cardStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    margin: "8px",
    width: "200px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
};

const playerNameStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
};

const statStyle: React.CSSProperties = {
    margin: "4px 0",
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
    return (
        <div style ={cardStyle}>
            <div style={playerNameStyle}>{player.full_name}</div>
        </div>
    );
};

