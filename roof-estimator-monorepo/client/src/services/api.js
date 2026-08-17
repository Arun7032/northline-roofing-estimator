const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.error || 'Request failed'); error.details = data.details; error.status = response.status; throw error; }
  return data;
}
export const api = {
  getConfig: () => request('/config'),
  estimate: (payload) => request('/estimate', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  adminConfig: () => request('/admin/config'),
  updateConfig: (payload) => request('/admin/config', { method: 'PUT', body: JSON.stringify(payload) }),
  leads: () => request('/admin/leads')
};
