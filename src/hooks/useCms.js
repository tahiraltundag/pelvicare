import { useState, useEffect } from 'react';
import api from '../api/client';

const CACHE_KEY = 'pelvicare_cms';

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch { return null; }
}

function writeCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

export function bustCmsCache(newData) {
  if (newData) writeCache(newData);
  else { try { localStorage.removeItem(CACHE_KEY); } catch {} }
}

export function useCms() {
  const [cms, setCms] = useState(() => readCache() || {});

  useEffect(() => {
    api.get('/cms').then(res => {
      if (res.success) {
        setCms(res.data);
        writeCache(res.data);
      }
    });
  }, []);

  const get = (key, fallback = '') => cms[key]?.value || fallback;

  const getJson = (key, fallback = []) => {
    const v = get(key, '');
    if (!v) return fallback;
    try { return JSON.parse(v); } catch { return fallback; }
  };

  return { get, getJson };
}
