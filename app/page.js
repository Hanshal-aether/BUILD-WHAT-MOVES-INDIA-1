'use client';

import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import StateSelectorModal from '../components/StateSelectorModal';
import { useLanguage } from '../context/LanguageContext';

const SERVICES = ['new_card', 'add_member', 'update_address', 'lost_card'];
const SERVICE_ICONS = {
  new_card: '🆕',
  add_member: '👨‍👩‍👧',
  update_address: '🏠',
  lost_card: '🔁',
};

function HomeContent() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ink">
      <Header />
      <StateSelectorModal />

      <div className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600" />
        <div className="absolute -top-20 -right-10 w-72 h-72 bg-saffron-500/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-brand-400/30 rounded-full blur-3xl" />
        <main className="relative max-w-5xl mx-auto px-4 pt-8 pb-10">
          <div className="animate-fadeIn mb-6">
            <h1 className="text-3xl font-display font-bold tracking-tight text-white">
              {t('home.welcome')}
            </h1>
            <p className="text-white/70 text-sm mt-1.5">{t('home.subtitle')}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 animate-fadeIn" style={{ animationDelay: '0.05s' }}>
            <QuickCard icon="◷" label={t('home.status')} onClick={() => router.push('/status')} />
            <QuickCard icon="🏪" label={t('home.shops')} onClick={() => router.push('/shops')} />
            <QuickCard icon="➕" label={t('home.apply')} onClick={() => router.push('/apply')} accent />
          </div>
        </main>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 pb-24 sm:pb-10">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          {t('home.allServices')}
        </h2>
        <div className="space-y-2">
          {SERVICES.map((s, i) => (
            <button
              key={s}
              onClick={() => router.push(`/apply/${s}/form`)}
              className="w-full flex items-center gap-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-brand-300 dark:hover:border-brand-400 hover:bg-brand-50/40 dark:hover:bg-white/10 rounded-2xl px-4 py-3.5 text-left transition-all shadow-sm hover:shadow-md animate-slideIn"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <span className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-white/10 flex items-center justify-center text-xl shrink-0">
                {SERVICE_ICONS[s]}
              </span>
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

function QuickCard({ icon, label, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl py-5 transition-all hover:-translate-y-0.5 ${
        accent
          ? 'bg-saffron-500 hover:bg-saffron-400 shadow-lg shadow-saffron-900/20'
          : 'bg-white/10 border border-white/15 backdrop-blur hover:bg-white/15'
      }`}
    >
      <span className={`text-2xl ${accent ? '' : 'text-white'}`}>{icon}</span>
      <span className={`text-sm font-medium ${accent ? 'text-ink' : 'text-white'}`}>{label}</span>
    </button>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
