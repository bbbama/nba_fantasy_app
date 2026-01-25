import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getLeaderboard = async (token: string) => {
    const response = await api.get('/leaderboard', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const registerUser = async (email: string, password: string, nickname?: string) => {
    const response = await api.post('/register', { email, password, nickname });
    return response.data;
};

export const loginUser = async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};

export const getUsersMe = async (token: string) => {
    const response = await api.get('/users/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const changePassword = async (token: string, data: any) => {
    const response = await api.put('/users/me/change-password', data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getPlayers = async (token: string) => {
    const response = await api.get('/players', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getMyTeam = async (token: string) => {
    const response = await api.get('/me/team', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const addPlayerToTeam = async (token: string, playerId: number) => {
    const response = await api.post(`/me/team/players/${playerId}`, 
    {}, // No body needed for this request
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const removePlayerFromTeam = async (token: string, playerId: number) => {
    const response = await api.delete(`/me/team/players/${playerId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// --- League API Services ---
export const createLeague = async (token: string, name: string) => {
    const response = await api.post('/leagues', { name }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getLeagues = async (token: string) => {
    const response = await api.get('/leagues', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getLeagueDetails = async (token: string, leagueId: number) => {
    const response = await api.get(`/leagues/${leagueId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const joinLeague = async (token: string, inviteCode: string) => {
    const response = await api.post(`/leagues/join/${inviteCode}`, {}, { // Empty body for POST request
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteLeague = async (token: string, leagueId: number) => {
    const response = await api.delete(`/leagues/${leagueId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default api;

// --- Admin API Services ---

export const adminGetAllUsers = async (token: string) => {
    const response = await api.get('/admin/users', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const adminDeleteUser = async (token: string, userId: number) => {
    const response = await api.delete(`/admin/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const adminResetUserPassword = async (token: string, userId: number) => {
    const response = await api.put(`/admin/users/${userId}/reset-password`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const adminSyncPlayersData = async (token: string) => {
    const response = await api.post('/admin/sync-players', {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

