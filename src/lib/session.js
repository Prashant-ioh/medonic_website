import { useEffect, useState } from 'react';

// Patient session kept in localStorage so a signed-in visitor stays signed in on this device.
const KEY = 'medislip.session';
const EVENT = 'medislip:session';

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function saveSession({ token, refreshToken, data }) {
  const session = { token, refreshToken, user: data };
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // Storage blocked (private mode etc.) — the session just won't persist.
  }
  window.dispatchEvent(new Event(EVENT));
  return session;
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useSession() {
  const [session, setSession] = useState(getSession);

  useEffect(() => {
    const sync = () => setSession(getSession());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return session;
}
