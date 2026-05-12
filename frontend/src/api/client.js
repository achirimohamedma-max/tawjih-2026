import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

let adminKey = null;
export function setAdminKey(k) {
  adminKey = k;
}
export function getAdminKey() {
  return adminKey;
}
export function clearAdminKey() {
  adminKey = null;
}

apiClient.interceptors.request.use((cfg) => {
  if (cfg.url?.startsWith('/admin') && adminKey) {
    cfg.headers['X-Admin-Key'] = adminKey;
  }
  return cfg;
});
