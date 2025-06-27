import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flashcard API functions
export const fetchFlashcards = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      params.append('difficulty', filters.difficulty);
    }
    if (filters.mastered && filters.mastered !== 'all') {
      params.append('mastered', filters.mastered);
    }

    const response = await api.get(`/flashcards?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
};

export const fetchFlashcard = async (id) => {
  try {
    const response = await api.get(`/flashcards/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    throw error;
  }
};

export const createFlashcard = async (cardData) => {
  try {
    const response = await api.post('/flashcards', cardData);
    return response.data;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
};

export const updateFlashcard = async (id, cardData) => {
  try {
    const response = await api.put(`/flashcards/${id}`, cardData);
    return response.data;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    throw error;
  }
};

export const deleteFlashcard = async (id) => {
  try {
    const response = await api.delete(`/flashcards/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    throw error;
  }
};

export const fetchStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
};

export default api; 