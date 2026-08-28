'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

const ROUTES = [
  { href: '/', key: 'home', icon: '⌂' },
  { href: '/apply', key: 'apply', icon: '➕' },
  { href: '/status', key: 'status', icon: '◷' },
  { href: '/shops', key: 'shops', icon: '🏪' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-ink/90 backdrop-blur-lg border-t border-brand-100 dark:border-white/10 sm:hidden transition-colors">
      <div className="flex items-stretch">
        {ROUTES.map((r) => {
          const active = pathname === r.href;
          return (
            <button
              key={r.href}
              onClick={() => router.push(r.href)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 border-t-2 transition-colors ${
                active ? 'border-brand-600 text-brand-600 dark:text-brand-300' : 'border-transparent text-gray-500 dark:text-gray-400'
              }`}
            >
              <span className="text-lg leading-none">{r.icon}</span>
              <span className="text-[11px] font-medium">{t(`nav.${r.key}`)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
