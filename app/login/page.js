'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../../components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { t, lang, toggleLang } = useLanguage();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const flag = window.localStorage.getItem('ration_saathi_logged_in');
    if (flag === 'true') router.replace('/');
  }, [router]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!/^\d{10}$/.test(phone)) {
      setError(t('login.errorPhone'));
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      setError(t('login.errorPin'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      window.localStorage.setItem('ration_saathi_logged_in', 'true');
      window.localStorage.setItem('ration_saathi_phone', phone);
      router.replace('/');
    }, 600);
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500" />
      <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-brand-400/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] bg-saffron-500/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-brand-300/20 rounded-full blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <button
        onClick={toggleLang}
        className="absolute top-5 right-5 z-10 text-sm font-medium text-white/90 px-3 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
      >
        {lang === 'en' ? 'हिं' : 'EN'}
      </button>

      <div className="relative z-10 w-full max-w-sm animate-fadeIn">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur mb-4 shadow-xl">
            <Logo size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">{t('login.title')}</h1>
          <p className="text-white/70 text-sm mt-2">{t('login.subtitle')}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-white/90 mb-1.5">
              {t('login.phoneLabel')}
            </label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder={t('login.phonePlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-white/90 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/90 mb-1.5">
              {t('login.pinLabel')}
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder={t('login.pinPlaceholder')}
              className="w-full px-4 py-3 rounded-xl bg-white/90 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {error && (
            <div className="text-sm text-red-100 bg-red-500/30 border border-red-300/40 rounded-xl px-3 py-2 animate-fadeIn">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 rounded-full border-2 border-brand-300 border-t-brand-700 animate-spin" />}
            {loading ? t('login.loading') : t('login.submit')}
          </button>

          <p className="text-center text-xs text-white/70">{t('login.demoHint')}</p>
        </form>
      </div>
    </div>
  );
}
