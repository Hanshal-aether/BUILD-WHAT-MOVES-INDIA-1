'use client';

import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import StateSelectorModal from '../../components/StateSelectorModal';
import { useLanguage } from '../../context/LanguageContext';

const SERVICES = ['new_card', 'add_member', 'update_address', 'lost_card'];
const SERVICE_ICONS = {
  new_card: '🆕',
  add_member: '👨‍👩‍👧',
  update_address: '🏠',
  lost_card: '🔁',
};

function ApplyContent() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ink">
      <Header />
      <StateSelectorModal />
      <main className="max-w-3xl mx-auto px-4 py-6 pb-24 sm:pb-10">
        <div className="mb-6 animate-fadeIn">
          <h1 className="text-2xl font-display font-bold tracking-tight dark:text-white">{t('home.apply')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('home.allServices')}</p>
        </div>
        <div className="space-y-2">
          {SERVICES.map((s, i) => (
            <button
              key={s}
              onClick={() => router.push(`/apply/${s}/form`)}
              className="w-full flex items-center gap-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-400 hover:bg-brand-50/40 dark:hover:bg-white/10 rounded-2xl px-4 py-4 text-left transition-all shadow-sm hover:shadow-md animate-slideIn"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <span className="text-2xl">{SERVICE_ICONS[s]}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{t(`services.${s}.title`)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t(`services.${s}.desc`)}</div>
              </div>
              <span className="text-gray-300 dark:text-gray-600">→</span>
            </button>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <ProtectedRoute>
      <ApplyContent />
    </ProtectedRoute>
  );
}
