import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error handling
const handleError = (error: any): never => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    throw new Error(error.response.data.error || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API No Response:', error.request);
    throw new Error('No response from server');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Request Error:', error.message);
    throw new Error(error.message || 'Unknown error occurred');
  }
};

// Fetch available players
export const fetchPlayers = async () => {
  try {
    const response = await api.get<ApiResponse<any[]>>('/players');
    
    if (response.data.success && response.data.data) {
      return response.data.data.map(player => ({
        id: player.id,
        name: player.name
      }));
    }
    
    throw new Error('Failed to fetch players');
  } catch (error) {
    return handleError(error);
  }
};

// Fetch available teams
export const fetchTeams = async () => {
  try {
    const response = await api.get<ApiResponse<any[]>>('/teams');
    
    if (response.data.success && response.data.data) {
      return response.data.data.map(team => ({
        id: team.id,
        name: team.name
      }));
    }
    
    throw new Error('Failed to fetch teams');
  } catch (error) {
    return handleError(error);
  }
};

// Fetch available seasons
export const fetchSeasons = async () => {
  try {
    const response = await api.get<ApiResponse<string[]>>('/seasons');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error('Failed to fetch seasons');
  } catch (error) {
    return handleError(error);
  }
};

// Fetch player shots
export const fetchPlayerShots = async (
  playerId: string,
  season: string,
  filters?: {
    shotTypes?: string[];
    opponent?: string | null;
    dateRange?: [string, string] | null;
  }
) => {
  try {
    // Build query params
    const params: Record<string, any> = {};
    
    if (filters?.shotTypes && filters.shotTypes.length > 0) {
      params.shotTypes = filters.shotTypes;
    }
    
    if (filters?.opponent) {
      params.opponent = filters.opponent;
    }
    
    if (filters?.dateRange) {
      params.startDate = filters.dateRange[0];
      params.endDate = filters.dateRange[1];
    }
    
    const response = await api.get<ApiResponse<any[]>>(`/shots/player/${playerId}/season/${season}`, { params });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error('Failed to fetch player shots');
  } catch (error) {
    return handleError(error);
  }
};

// Fetch player statistics
export const fetchPlayerStats = async (
  playerId: string,
  season: string,
  filters?: {
    shotTypes?: string[];
    opponent?: string | null;
    dateRange?: [string, string] | null;
  }
) => {
  try {
    // Build query params
    const params: Record<string, any> = {};
    
    if (filters?.shotTypes && filters.shotTypes.length > 0) {
      params.shotTypes = filters.shotTypes;
    }
    
    if (filters?.opponent) {
      params.opponent = filters.opponent;
    }
    
    if (filters?.dateRange) {
      params.startDate = filters.dateRange[0];
      params.endDate = filters.dateRange[1];
    }
    
    const response = await api.get<ApiResponse<any>>(`/stats/player/${playerId}/season/${season}`, { params });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error('Failed to fetch player statistics');
  } catch (error) {
    return handleError(error);
  }
};

export default api;