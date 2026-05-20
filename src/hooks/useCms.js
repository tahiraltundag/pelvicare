import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

const CACHE_KEY = 'pelvicare_cms';
const CMS_UPDATE_EVENT = 'pelvicare_cms_updated';

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch { return null; }
}

function writeCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

export function bustCmsCache(newData) {
  if (newData) {
    writeCache(newData);
    window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: newData }));
  } else {
    try { localStorage.removeItem(CACHE_KEY); } catch {}
  }
}

export function useCms() {
  const [cms, setCms] = useState(() => readCache() || {});

  const fetchCms = useCallback(() => {
    api.get('/cms').then(res => {
      if (res.success) {
        setCms(res.data);
        writeCache(res.data);
      }
    });
  }, []);

  useEffect(() => {
    fetchCms();

    const handleUpdate = (e) => {
      if (e.detail) {
        setCms(e.detail);
      } else {
        fetchCms();
      }
    };

    const handleStorage = (e) => {
      if (e.key === CACHE_KEY && e.newValue) {
        try { setCms(JSON.parse(e.newValue)); } catch {}
      }
    };

    window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchCms]);

  const get = (key, fallback = '') => cms[key]?.value || fallback;

  const getJson = (key, fallback = []) => {
    const v = get(key, '');
    if (!v) return fallback;
    try { return JSON.parse(v); } catch { return fallback; }
  };

  return { get, getJson };
}
