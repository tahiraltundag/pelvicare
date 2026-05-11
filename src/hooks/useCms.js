import { useState, useEffect } from 'react';
import api from '../api/client';

let cmsCache = null;
let cacheTs = 0;
const TTL = 5 * 60 * 1000;

export function clearCmsCache() {
  cmsCache = null;
  cacheTs = 0;
  window.dispatchEvent(new Event('cms:updated'));
}

export function useCms() {
  const [cms, setCms] = useState(cmsCache || {});

  useEffect(() => {
    const fetchData = () => {
      if (cmsCache && Date.now() - cacheTs < TTL) {
        setCms(cmsCache);
        return;
      }
      api.get('/cms').then(res => {
        if (res.success) {
          cmsCache = res.data;
          cacheTs = Date.now();
          setCms(res.data);
        }
      });
    };

    fetchData();
    window.addEventListener('cms:updated', fetchData);
    return () => window.removeEventListener('cms:updated', fetchData);
  }, []);

  const get = (key, fallback = '') => cms[key]?.value || fallback;

  const getJson = (key, fallback = []) => {
    const v = get(key, '');
    if (!v) return fallback;
    try { return JSON.parse(v); } catch { return fallback; }
  };

  return { get, getJson };
}
