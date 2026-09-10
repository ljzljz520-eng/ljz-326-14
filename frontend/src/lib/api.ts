import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || '网络请求失败，请稍后重试';
    
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// 封装请求方法，返回正确的类型
const request = {
  get: <T = any>(url: string): Promise<T> => api.get(url) as Promise<T>,
  post: <T = any>(url: string, data?: any): Promise<T> => api.post(url, data) as Promise<T>,
  patch: <T = any>(url: string, data?: any): Promise<T> => api.patch(url, data) as Promise<T>,
  delete: <T = any>(url: string): Promise<T> => api.delete(url) as Promise<T>,
};

// Auth API
export const authApi = {
  register: (data: { username: string; email: string; password: string; minecraftUsername?: string }) =>
    request.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    request.post<{ accessToken: string; user: any; message: string }>('/auth/login', data),
  forgotPassword: (data: { email: string }) =>
    request.post('/auth/forgot-password', data),
  resetPassword: (data: { token: string; password: string }) =>
    request.post('/auth/reset-password', data),
  verifyEmail: (token: string) =>
    request.get(`/auth/verify-email?token=${token}`),
};

// User API
export const userApi = {
  getProfile: () => request.get<any>('/users/profile'),
  updateProfile: (data: { minecraftUsername?: string; avatar?: string }) =>
    request.patch<any>('/users/profile', data),
  getAll: () => request.get<any[]>('/users'),
};

// News API
export const newsApi = {
  getAll: (all?: boolean) => request.get<any[]>(`/news${all ? '?all=true' : ''}`),
  getLatest: (limit?: number) => request.get<any[]>(`/news/latest${limit ? `?limit=${limit}` : ''}`),
  getOne: (id: number) => request.get<any>(`/news/${id}`),
  create: (data: any) => request.post('/news', data),
  update: (id: number, data: any) => request.patch(`/news/${id}`, data),
  delete: (id: number) => request.delete(`/news/${id}`),
};

// QA API
export const qaApi = {
  getAll: (all?: boolean) => request.get<any[]>(`/qa${all ? '?all=true' : ''}`),
  getCategories: () => request.get<string[]>('/qa/categories'),
  getByCategory: (category: string) => request.get<any[]>(`/qa/category/${category}`),
  search: (keyword: string) => request.get<any[]>(`/qa/search?keyword=${keyword}`),
  getOne: (id: number) => request.get<any>(`/qa/${id}`),
  create: (data: any) => request.post('/qa', data),
  update: (id: number, data: any) => request.patch(`/qa/${id}`, data),
  delete: (id: number) => request.delete(`/qa/${id}`),
};

// Server Status API
export const serverApi = {
  getStatus: () => request.get<any>('/server-status'),
  getInfo: () => request.get<any>('/server-status/info'),
  getHistory: (limit?: number) => request.get<any[]>(`/server-status/history${limit ? `?limit=${limit}` : ''}`),
  updateStatus: (data: any) => request.post('/server-status', data),
};

// Leaderboard API
export const leaderboardApi = {
  getPlaytime: (limit?: number) => request.get<any[]>(`/leaderboard/playtime${limit ? `?limit=${limit}` : ''}`),
  getAchievements: (limit?: number) => request.get<any[]>(`/leaderboard/achievements${limit ? `?limit=${limit}` : ''}`),
};

// Announcements API
export const announcementApi = {
  getAll: (all?: boolean) => request.get<any[]>(`/announcements${all ? '?all=true' : ''}`),
  getLatest: (limit?: number) => request.get<any[]>(`/announcements/latest${limit ? `?limit=${limit}` : ''}`),
  getOne: (id: number) => request.get<any>(`/announcements/${id}`),
  create: (data: any) => request.post('/announcements', data),
  update: (id: number, data: any) => request.patch(`/announcements/${id}`, data),
  delete: (id: number) => request.delete(`/announcements/${id}`),
};

// Gameplay API
export const gameplayApi = {
  getAll: (all?: boolean) => request.get<any[]>(`/gameplay${all ? '?all=true' : ''}`),
  getFeatured: () => request.get<any[]>('/gameplay/featured'),
  getByMode: (mode: string) => request.get<any[]>(`/gameplay/mode/${mode}`),
  getOne: (id: number) => request.get<any>(`/gameplay/${id}`),
  create: (data: any) => request.post('/gameplay', data),
  update: (id: number, data: any) => request.patch(`/gameplay/${id}`, data),
  delete: (id: number) => request.delete(`/gameplay/${id}`),
};

export default api;
