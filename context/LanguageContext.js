'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { t as translate, LANGS } from '../lib/i18n';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'ration_saathi_lang';
const CODES = LANGS.map((l) => l.code); // ['en', 'hi', 'mr']

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (CODES.includes(saved)) setLang(saved);
    setReady(true);
  }, []);

  // Cycles en -> hi -> mr -> en. Kept as a single "tap to advance" control
  // (rather than a 3-button switcher) so it still fits in the same compact
  // header slot it always has.
  const toggleLang = () => {
    setLang((prev) => {
      const next = CODES[(CODES.indexOf(prev) + 1) % CODES.length];
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const t = (path) => translate(lang, path);
  const langLabel = LANGS.find((l) => l.code === lang)?.label || 'EN';

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, ready, langLabel }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
