'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../../components/Logo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { t, lang, toggleLang, langLabel } = useLanguage();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const flag = window.localStorage.getItem('ration_saathi_logged_in');
    if (flag === 'true') router.replace('/home');
  }, [router]);

  async function handleSendOtp(e) {
    e.preventDefault();
    setError('');

    if (!EMAIL_REGEX.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send code');
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code sent to your email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      const previousEmail = window.localStorage.getItem('ration_saathi_email');
if (previousEmail && previousEmail !== email) {
  // Switching accounts in this browser — clear the old account's
  // card-linking state so the new account isn't wrongly skipped past it.
  window.localStorage.removeItem('ration_saathi_card_number');
  window.localStorage.removeItem('ration_saathi_household');
  window.localStorage.removeItem('ration_saathi_phone');
}

window.localStorage.setItem('ration_saathi_logged_in', 'true');
window.localStorage.setItem('ration_saathi_email', email);
const hasCard = window.localStorage.getItem('ration_saathi_card_number');
router.replace(hasCard ? '/home' : '/link-card');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-grain">
      <div className="absolute inset-0 bg-ink" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500" />
      <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-brand-400/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] bg-saffron-500/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-brand-300/20 rounded-full blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <button
        onClick={toggleLang}
        className="absolute top-5 right-5 z-10 text-sm font-medium text-white/90 px-3 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
      >
        {langLabel}
      </button>

      <div className="relative z-10 w-full max-w-sm animate-fadeIn">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center bg-white rounded-2xl p-3 mb-4 shadow-xl">
            <Logo size={56} />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">{t('login.title')}</h1>
          <p className="text-white/70 text-sm mt-2">
            {step === 'email' ? t('login.subtitle') : `Code sent to ${email}`}
          </p>
        </div>

        <form
          onSubmit={step === 'email' ? handleSendOtp : handleVerifyOtp}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl ring-1 ring-inset ring-white/10 space-y-4"
        >
          {step === 'email' ? (
            <div>
              <label className="block text-xs font-medium text-white/90 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-white/90 mb-1.5">6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder:text-gray-400 text-center tracking-[0.4em] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          )}

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
            {loading ? 'Please wait...' : step === 'email' ? 'Send code' : 'Verify & continue'}
          </button>

          {step === 'otp' && (
            <button
              type="button"
              onClick={() => { setStep('email'); setCode(''); setError(''); }}
              className="w-full text-center text-xs text-white/70 hover:text-white"
            >
              ← Change email
            </button>
          )}

          <a
            href="/about"
            className="block text-center text-xs text-white/60 hover:text-white/90 underline transition-colors pt-1"
          >
            Why we built this →
          </a>
        </form>
      </div>
    </div>
  );
}