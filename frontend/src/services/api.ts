import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gov_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

export const challengeApi = {
  getAll: () => api.get('/challenges'),
  getById: (id: string) => api.get(`/challenges/${id}`),
  create: (data: any) => api.post('/challenges', data),
  publish: (id: string) => api.post(`/challenges/${id}/publish`),
  runMatches: (id: string) => api.post(`/challenges/${id}/matches`)
};

export const matchApi = {
  shortlist: (id: string) => api.post(`/matches/${id}/shortlist`)
};

export const startupApi = {
  getAll: () => api.get('/startups'),
  getById: (id: string) => api.get(`/startups/${id}`)
};

export const pilotApi = {
  getAll: () => api.get('/pilots'),
  getById: (id: string) => api.get(`/pilots/${id}`),
  create: (data: any) => api.post('/pilots', data),
  updateKPIs: (id: string, kpis: any[]) => api.post(`/pilots/${id}/kpis`, { kpis }),
  evaluate: (id: string) => api.post(`/pilots/${id}/evaluate`)
};

export const evidenceApi = {
  submit: (data: any) => api.post('/evidence', data),
  verify: (id: string, status: 'Verified' | 'Rejected') => api.post(`/evidence/${id}/verify`, { status }),
  generatePassport: (pilot_id: string) => api.post('/evidence/passport', { pilot_id }),
  getPassport: (pilotId: string) => api.get(`/evidence/passport/${pilotId}`)
};

export const scaleApi = {
  getScenario: (pilotId: string) => api.get(`/scale/${pilotId}`)
};

export const procurementApi = {
  get: (pilotId: string) => api.get(`/procurement/${pilotId}`),
  update: (pilotId: string, status: string, notes?: string) => api.put(`/procurement/${pilotId}`, { status, notes })
};

export const auditApi = {
  getLogs: () => api.get('/audit')
};

export default api;
