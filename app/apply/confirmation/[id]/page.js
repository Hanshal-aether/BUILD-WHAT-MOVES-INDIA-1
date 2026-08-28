'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Header from '../../../../components/Header';
import BottomNav from '../../../../components/BottomNav';
import { useLanguage } from '../../../../context/LanguageContext';

function ConfirmationContent() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [refNumber, setRefNumber] = useState('');

  useEffect(() => {
    const id = params.id || '';
    setRefNumber(`RS-${id.replace(/-/g, '').slice(-8).toUpperCase()}`);
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ink">
      <Header />
      <main className="max-w-md mx-auto px-4 py-10 pb-24 text-center">
        <div className="text-6xl mb-4 animate-popIn">✅</div>
        <h1 className="text-2xl font-display font-bold tracking-tight mb-1 dark:text-white">{t('confirmation.title')}</h1>

        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeIn">
          <div className="text-xs text-gray-500 mb-1">{t('confirmation.refNumber')}</div>
          <div className="text-xl font-mono font-semibold tracking-wide text-brand-700">{refNumber}</div>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left animate-fadeIn">
          <h2 className="font-semibold mb-3">{t('confirmation.whatNext')}</h2>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center shrink-0">1</span>
              {t('confirmation.step1')}
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center shrink-0">2</span>
              {t('confirmation.step2')}
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center shrink-0">3</span>
              {t('confirmation.step3')}
            </li>
          </ol>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => router.push('/status')}
            className="w-full py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
          >
            {t('confirmation.track')}
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            {t('confirmation.home')}
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <ProtectedRoute>
      <ConfirmationContent />
    </ProtectedRoute>
  );
}
