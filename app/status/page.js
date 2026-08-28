'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import StateSelectorModal from '../../components/StateSelectorModal';
import { useLanguage } from '../../context/LanguageContext';

const STATUS_STYLES = {
  new: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300', icon: '📝', progress: 20 },
  submitted: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300', icon: '✓', progress: 40 },
  under_review: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300', icon: '🔍', progress: 60 },
  approved: { badge: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300', icon: '✓✓', progress: 100 },
  needs_correction: { badge: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300', icon: '⚠️', progress: 30 },
};

const CONTACT_LABELS = { sms: 'SMS', call: 'Phone call', email: 'Email' };
const DOC_LABELS = {
  id_proof: 'Identification document',
  address_proof: 'Address proof',
  photo: 'Photograph',
  birth_cert: 'Birth certificate',
};

function StatusContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
    const phone = window.localStorage.getItem('ration_saathi_phone');
    if (!phone) {
      setApps([]);
      setLoading(false);
      return;
    }
    fetch(`/api/applications?phone=${encodeURIComponent(phone)}`)
      .then((res) => res.json())
      .then((data) => setApps(Array.isArray(data) ? data : []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ink">
      <Header />
      <StateSelectorModal />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <div className="mb-6 animate-fadeIn">
          <h1 className="text-2xl font-display font-bold tracking-tight dark:text-white">{t('status.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('status.subtitle')}</p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulseSoft" />
            ))}
          </div>
        )}

        {!loading && apps.length === 0 && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="text-5xl mb-3">📋</div>
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">{t('status.empty')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-5">{t('status.emptySub')}</p>
            <button
              onClick={() => router.push('/apply')}
              className="px-5 py-2.5 rounded-full bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              ➕ {t('status.startApp')}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {apps.map((app, i) => {
            const style = STATUS_STYLES[app.status] || STATUS_STYLES.new;
            const expanded = expandedId === app.id;
            let formData = {};
            try {
              formData = JSON.parse(app.formData || '{}');
            } catch {
              formData = {};
            }

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-4 animate-slideIn"
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {t(`services.${app.applicationType}.title`)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                      RS-{app.id.replace(/-/g, '').slice(-8).toUpperCase()}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${style.badge}`}>
                    {style.icon} {t(`statusLabels.${app.status}`)}
                  </span>
                </div>

                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden my-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-700 transition-all duration-500"
                    style={{ width: `${style.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-2">
                  <span>{t('status.submitted')}: {new Date(app.createdAt).toLocaleDateString()}</span>
                  <span>{t('status.updated')}: {new Date(app.updatedAt).toLocaleDateString()}</span>
                </div>

                {app.status === 'needs_correction' && (
                  <div className="text-xs text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg px-3 py-2 mb-3">
                    {t('status.issue')}
                  </div>
                )}

                {expanded && (
                  <div className="mb-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 text-sm space-y-2 animate-fadeIn">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Contact method</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {CONTACT_LABELS[formData.contact] || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Reason</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {formData.reason ? t(`services.${formData.reason}.title`) : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Documents submitted</span>
                      <ul className="mt-1 space-y-1">
                        {(formData.documents || []).length === 0 && (
                          <li className="text-gray-400 dark:text-gray-500">None on file</li>
                        )}
                        {(formData.documents || []).map((d) => (
                          <li key={d} className="text-gray-800 dark:text-gray-100">
                            ✓ {DOC_LABELS[d] || d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-white/10">
                      <span className="text-gray-500 dark:text-gray-400">Full reference</span>
                      <span className="font-mono font-medium text-gray-800 dark:text-gray-100">
                        RS-{app.id.replace(/-/g, '').slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedId(expanded ? null : app.id)}
                    className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/15 transition-colors"
                  >
                    {expanded ? 'Hide details' : t('status.viewDetails')}
                  </button>
                  {app.status === 'needs_correction' && (
                    <button
                      onClick={() => router.push(`/apply/${app.applicationType}/form`)}
                      className="flex-1 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                    >
                      {t('status.resubmit')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function StatusPage() {
  return (
    <ProtectedRoute>
      <StatusContent />
    </ProtectedRoute>
  );
}
