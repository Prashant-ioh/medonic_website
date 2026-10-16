// All calls go to same-origin /api, which Vercel (vercel.json) and the Vite dev server
// (vite.config.js) forward to the MediSlip backend — so the browser never needs CORS.
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Could not reach MediSlip. Check your connection and try again.');
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || 'Something went wrong. Please try again.');
  }
  return data;
}
