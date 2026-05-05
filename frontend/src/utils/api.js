import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('mfn_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mfn_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// Helper - resolve image URL
export const resolveImg = (path) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');
  return `${base}/uploads/${path.replace('uploads/', '')}`;
};

export const storiesAPI = {
  getAll:    (params) => api.get('/stories', { params }),
  getOne:    (id)     => api.get(`/stories/${id}`),
  getPopular:(params) => api.get('/stories/stats/popular', { params }),
  create:    (data)   => api.post('/stories', data),
  update:    (id, data) => api.put(`/stories/${id}`, data),
  delete:    (id)     => api.delete(`/stories/${id}`),
  react:     (id, type) => api.post(`/stories/${id}/react`, { type }),
};

export const authorsAPI = {
  getAll:    ()       => api.get('/authors'),
  getOne:    (id)     => api.get(`/authors/${id}`),
  getStories:(id, params) => api.get(`/authors/${id}/stories`, { params }),
  create:    (data)   => api.post('/authors', data),
  update:    (id, data) => api.put(`/authors/${id}`, data),
  delete:    (id)     => api.delete(`/authors/${id}`),
};

export const commentsAPI = {
  getAll:    (params) => api.get('/comments', { params }),
  getByStory:(id)     => api.get(`/comments/story/${id}`),
  create:    (data)   => api.post('/comments', data),
  approve:   (id)     => api.put(`/comments/${id}/approve`),
  spam:      (id)     => api.put(`/comments/${id}/spam`),
  delete:    (id)     => api.delete(`/comments/${id}`),
};

export const videosAPI = {
  getAll:    (params) => api.get('/videos', { params }),
  create:    (data)   => api.post('/videos', data),
  delete:    (id)     => api.delete(`/videos/${id}`),
};

export const adsAPI = {
  getAll:      (params) => api.get('/ads', { params }),
  getAllAdmin:  ()       => api.get('/ads/all'),
  create:      (data)   => api.post('/ads', data),
  toggle:      (id)     => api.put(`/ads/${id}/toggle`),
  delete:      (id)     => api.delete(`/ads/${id}`),
};

export const subscribeAPI = {
  subscribe: (data) => api.post('/subscribe', data),
  getAll:    ()     => api.get('/subscribers'),
};

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getAuditLogs:() => api.get('/audit-logs'),
};

export const breakingAPI = {
  get: () => api.get('/breaking'),
};

export const authAPI = {
  login:          (data) => api.post('/auth/login', data),
  me:             ()     => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
  getUsers:       ()     => api.get('/auth/users'),
  createUser:     (data) => api.post('/auth/users', data),
};

export default api;
