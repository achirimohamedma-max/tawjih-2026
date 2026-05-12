import { apiClient } from './client.js';

export const startAttempt = (body) => apiClient.post('/attempts/start', body).then((r) => r.data);
export const submitAttempt = (id, body) =>
  apiClient.post(`/attempts/${id}/submit`, body).then((r) => r.data);
export const getAttempt = (id, sessionId) =>
  apiClient.get(`/attempts/${id}`, { params: { sessionId } }).then((r) => r.data);
export const listAttempts = (sessionId, params) =>
  apiClient.get(`/attempts/by-session/${sessionId}`, { params }).then((r) => r.data);
