import { useState, useEffect } from 'react';
import api from '../api/client';

export function bustCmsCache() {}

export function useCms() {
  const [cms, setCms] = useState({});

  useEffect(() => {
    api.get('/cms').then(res => {
      if (res.success) setCms(res.data);
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
