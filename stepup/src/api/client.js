//const API_BASE = '/api';
const API_BASE = import.meta.env.VITE_API_URL;
async function request(path, options = {}) {
  const { body, headers = {}, ...rest } = options;

  const config = {
    ...rest,
    headers: { ...headers },
  };

  if (body instanceof FormData) {
    config.body = body;
  } else if (body !== undefined) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  const text = await response.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    const fieldErrors = Object.values(data)
      .flat()
      .filter((value) => typeof value === 'string' && value.trim());
    const message =
      data.error ||
      data.detail ||
      (fieldErrors.length ? fieldErrors.join(', ') : '') ||
      text.trim().slice(0, 200) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return text ? data : null;

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
  upload: (path, formData) => request(path, { method: 'POST', body: formData }),
};

export default api;
