const BASE_URL = '/api';

function getTokens() {
  try {
    return {
      accessToken: localStorage.getItem('pelvi_access_token'),
      refreshToken: localStorage.getItem('pelvi_refresh_token'),
    };
  } catch {
    return {};
  }
}

function setTokens(accessToken, refreshToken) {
  localStorage.setItem('pelvi_access_token', accessToken);
  if (refreshToken) localStorage.setItem('pelvi_refresh_token', refreshToken);
}

function clearTokens() {
  localStorage.removeItem('pelvi_access_token');
  localStorage.removeItem('pelvi_refresh_token');
  localStorage.removeItem('pelvi_user');
}

let isRefreshing = false;
let refreshCallbacks = [];

async function refreshAccessToken() {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error('No refresh token');

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!data.success) { clearTokens(); throw new Error('Session expired'); }
  setTokens(data.data.accessToken, data.data.refreshToken);
  localStorage.setItem('pelvi_user', JSON.stringify(data.data.user));
  return data.data.accessToken;
}

async function request(path, options = {}) {
  const { accessToken } = getTokens();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && accessToken) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshCallbacks.push({ resolve, reject, path, options });
      });
    }
    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      refreshCallbacks.forEach(cb => {
        request(cb.path, cb.options).then(cb.resolve).catch(cb.reject);
      });
      refreshCallbacks = [];
      headers['Authorization'] = `Bearer ${newToken}`;
      return fetch(`${BASE_URL}${path}`, { ...options, headers }).then(r => r.json());
    } catch {
      isRefreshing = false;
      refreshCallbacks.forEach(cb => cb.reject(new Error('Session expired')));
      refreshCallbacks = [];
      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      throw new Error('Session expired');
    }
  }

  return res.json();
}

async function uploadFiles(path, files) {
  const { accessToken } = getTokens();
  const formData = new FormData();
  files.forEach(f => formData.append('images', f));
  const headers = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body: formData });
  return res.json();
}

export const api = {
  get: (path, params) => {
    const url = params ? `${path}?${new URLSearchParams(params)}` : path;
    return request(url);
  },
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
  upload: uploadFiles,
  setTokens,
  clearTokens,
  getTokens,
};

export default api;
