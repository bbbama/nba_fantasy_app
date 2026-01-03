import axios from 'axios';

const API_URL = 'http://localhost:8000';

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

export const registerUser = async (email: string, password: string) => {
    const response = await api.post('/register', { email, password });
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

export default api;
