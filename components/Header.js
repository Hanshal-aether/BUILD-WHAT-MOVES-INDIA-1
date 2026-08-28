'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAppState } from '../context/StateContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

export default function Header() {
  const router = useRouter();
  const { lang, toggleLang, t } = useLanguage();
  const { state, isPilot, setModalOpen } = useAppState();
  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    window.localStorage.removeItem('ration_saathi_logged_in');
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-lg bg-white/70 dark:bg-ink/80 border-b border-brand-100 dark:border-white/10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2.5 font-semibold text-ink dark:text-white shrink-0"
        >
          <Logo size={32} className="drop-shadow-sm" />
          <span className="hidden sm:inline tracking-tight font-display text-[15px]">{t('appName')}</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 text-sm px-2.5 sm:px-3 py-1.5 rounded-full border border-brand-200 dark:border-white/15 bg-white/80 dark:bg-white/5 dark:text-gray-200 shadow-soft hover:bg-brand-50 dark:hover:bg-white/10 hover:border-brand-400 transition-all"
          >
            <span>{isPilot ? '📍' : '🌐'}</span>
            <span className="hidden xs:inline max-w-[6rem] sm:max-w-none truncate">{state}</span>
          </button>

          <button
            onClick={toggleLang}
            className="text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-full border border-brand-200 dark:border-white/15 bg-white/80 dark:bg-white/5 dark:text-gray-200 shadow-soft hover:bg-brand-50 dark:hover:bg-white/10 hover:border-brand-400 transition-all"
          >
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full border border-brand-200 dark:border-white/15 bg-white/80 dark:bg-white/5 shadow-soft hover:bg-brand-50 dark:hover:bg-white/10 hover:border-brand-400 transition-all flex items-center justify-center"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="relative">
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              className="w-9 h-9 rounded-full border border-brand-200 dark:border-white/15 bg-white/80 dark:bg-white/5 shadow-soft hover:bg-brand-50 dark:hover:bg-white/10 hover:border-brand-400 transition-all flex items-center justify-center"
              aria-label="Settings"
            >
              ⚙️
            </button>
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-brand-900 rounded-xl shadow-lg border border-gray-100 dark:border-white/10 py-1 animate-fadeIn overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-white/5 transition-colors"
                >
                  {t('header.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}