'use client';

import { STATES, PILOT_STATE } from '../lib/i18n';
import { useAppState } from '../context/StateContext';
import { useLanguage } from '../context/LanguageContext';

export default function StateSelectorModal() {
  const { modalOpen, setModalOpen, selectState, state } = useAppState();
  const { t } = useLanguage();

  if (!modalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fadeIn"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="bg-white dark:bg-brand-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('header.selectState')}</h3>
          <button
            onClick={() => setModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-2">
          {STATES.map((name) => {
            const isPilot = name === PILOT_STATE;
            const selected = name === state;
            return (
              <button
                key={name}
                onClick={() => selectState(name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                  selected
                    ? 'bg-brand-50 dark:bg-white/10 text-brand-700 dark:text-brand-200'
                    : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200'
                }`}
              >
                <span className="text-sm">{name}</span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    isPilot
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                      : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
                  }`}
                >
                  {isPilot ? t('header.pilot') : t('header.comingSoon')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
