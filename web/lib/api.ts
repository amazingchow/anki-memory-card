import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: number;
  word: string;
  definition: string;
  example: string;
  notes: string;
  created_at: string;
  updated_at: string;
  next_review: string;
  review_count: number;
  status: 'learning' | 'reviewing' | 'mastered';
}

export interface Review {
  id: number;
  card_id: number;
  review_date: string;
  rating: number;
  next_interval: number;
}

export interface BulkImportCard {
  word: string;
  definition: string;
  example?: string;
  notes?: string;
}

// Auth API
export const auth = {
  login: async (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const response = await api.post('/api/v1/users/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (email: string, password: string) => {
    const response = await api.post('/api/v1/users/register', { email, password });
    return response.data;
  },
};

// Cards API
export const cards = {
  getAll: async () => {
    const response = await api.get<Card[]>('/api/v1/cards/');
    return response.data;
  },

  getDue: async () => {
    const response = await api.get<Card[]>('/api/v1/cards/due/');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Card>(`/api/v1/cards/${id}`);
    return response.data;
  },

  create: async (data: Omit<Card, 'id' | 'created_at' | 'updated_at' | 'next_review' | 'review_count' | 'status'>) => {
    const response = await api.post<Card>('/api/v1/cards/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Omit<Card, 'id' | 'created_at' | 'updated_at' | 'next_review' | 'review_count' | 'status'>>) => {
    const response = await api.patch<Card>(`/api/v1/cards/${id}`, data);
    return response.data;
  },

  review: async (id: number, rating: number) => {
    const response = await api.post<Review>(`/api/v1/cards/${id}/review`, { card_id: id, rating });
    return response.data;
  },

  bulkImport: async (cards: BulkImportCard[]) => {
    const response = await api.post<Card[]>('/api/v1/cards/bulk', { cards });
    return response.data;
  },
};

export default api; 