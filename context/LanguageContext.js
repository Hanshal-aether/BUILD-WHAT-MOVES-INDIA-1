'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { t as translate } from '../lib/i18n';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'ration_saathi_lang';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'hi') setLang(saved);
    setReady(true);
  }, []);

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const t = (path) => translate(lang, path);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
