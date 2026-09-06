'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AccessibilityContext = createContext(null);
const A11Y_KEY = 'ration_saathi_large_text';

export function AccessibilityProvider({ children }) {
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(A11Y_KEY) === '1';
    setLargeText(saved);
    document.documentElement.classList.toggle('a11y-large-text', saved);
  }, []);

  const toggleLargeText = () => {
    setLargeText((prev) => {
      const next = !prev;
      window.localStorage.setItem(A11Y_KEY, next ? '1' : '0');
      document.documentElement.classList.toggle('a11y-large-text', next);
      return next;
    });
  };

  return (
    <AccessibilityContext.Provider value={{ largeText, toggleLargeText }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
