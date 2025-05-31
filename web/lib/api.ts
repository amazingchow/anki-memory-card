import axios from 'axios';

import {
  getToken,
  getUserId,
  removeAllCookies,
} from '@/lib/cookies';

// const API_URL = 'http://localhost:8000';
const API_URL = 'http://192.168.0.140:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add cookies to requests if it exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const userId = getUserId();
  if (userId) {
    config.headers.UserId = userId;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear cookies and redirect to login
      removeAllCookies();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  email: string;
  nickname?: string;
  gender?: string;
  usage_count?: number;
  is_premium?: boolean;
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

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  notification_types: {
    new_cards: boolean;
    study_reminders: boolean;
    achievement_unlocked: boolean;
    system_updates: boolean;
  };
  study_reminder_time: string;
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

  activate: async (token: string) => {
    const response = await api.get(`/api/v1/users/activate?token=${token}`);
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

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<Card[]>('/api/v1/cards/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Users API
export const users = {
  getProfile: async () => {
    const response = await api.get<User>(`/api/v1/users/profile`);
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch<User>(`/api/v1/users/profile`, data);
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await api.post(`/api/v1/users/cancel-subscription`);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete(`/api/v1/users/account`);
    return response.data;
  },

  getNotificationSettings: async () => {
    const response = await api.get<NotificationSettings>('/api/v1/users/notification-settings');
    return response.data;
  },

  updateNotificationSettings: async (settings: NotificationSettings) => {
    const response = await api.patch<NotificationSettings>('/api/v1/users/notification-settings', settings);
    return response.data;
  }
};

export default api; 