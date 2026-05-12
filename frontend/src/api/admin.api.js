import { apiClient } from './client.js';

export const adminListQuestions = (params) =>
  apiClient.get('/admin/questions', { params }).then((r) => r.data);
export const adminCreateQuestion = (body) =>
  apiClient.post('/admin/questions', body).then((r) => r.data);
export const adminUpdateQuestion = (id, body) =>
  apiClient.patch(`/admin/questions/${id}`, body).then((r) => r.data);
export const adminDeleteQuestion = (id) =>
  apiClient.delete(`/admin/questions/${id}`).then((r) => r.data);
export const adminTranslate = (id, body) =>
  apiClient.post(`/admin/questions/${id}/translate`, body).then((r) => r.data);

export const adminStats = {
  overview: () => apiClient.get('/admin/stats/overview').then((r) => r.data),
  questions: () => apiClient.get('/admin/stats/questions').then((r) => r.data),
  axes: () => apiClient.get('/admin/stats/axes').then((r) => r.data),
  activity: (days = 30) =>
    apiClient.get('/admin/stats/activity', { params: { days } }).then((r) => r.data),
};
