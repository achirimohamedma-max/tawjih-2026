import { apiClient } from './client.js';

export const listQuestions = (params) => apiClient.get('/questions', { params }).then((r) => r.data);
export const randomQuestions = (params) =>
  apiClient.get('/questions/random', { params }).then((r) => r.data);
export const getQuestion = (id, params) =>
  apiClient.get(`/questions/${id}`, { params }).then((r) => r.data);
