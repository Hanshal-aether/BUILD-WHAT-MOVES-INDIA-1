'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function ShopLoginPage() {
  return (
    <Suspense fallback={null}>
      <ShopLoginContent />
    </Suspense>
  );
}

function ShopLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginCode, setLoginCode] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);

  const doLogin = useCallback(
    async (code, pinValue) => {
      setError('');
      setLoading(true);
      try {
        const res = await fetch('/api/shops/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ loginCode: code, pin: pinValue }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Login failed');
          return;
        }
        window.localStorage.setItem('ration_saathi_shop', JSON.stringify(data));
        router.push('/shops/dashboard');
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
        setAutoLoggingIn(false);
      }
    },
    [router]
  );

  // Magic link: /shops/login?code=ANDHERI1&pin=1234 logs in with zero typing.
  // Meant to be handed to each shop as a QR code or a WhatsApp link they save
  // once — a dealer with a basic Android phone should never need to type a
  // code and PIN more than the first time.
  useEffect(() => {
    const codeParam = searchParams.get('code');
    const pinParam = searchParams.get('pin');
    if (codeParam && pinParam) {
      setAutoLoggingIn(true);
      doLogin(codeParam, pinParam);
    }
  }, [searchParams, doLogin]);

  async function handleSubmit(e) {
    e.preventDefault();
    doLogin(loginCode, pin);
  }

  if (autoLoggingIn) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-ink flex flex-col items-center justify-center gap-3 px-4">
        <div className="text-4xl">🏪</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error ? error : 'Signing you in…'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-ink flex flex-col">
      <Header />
      <main className="flex-1 max-w-sm mx-auto w-full px-4 py-10 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏪</div>
          <h1 className="text-xl font-display font-bold dark:text-white">Fair Price Shop Login</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your shop code and PIN to see today&apos;s bookings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shop code</label>
            <input
              type="text"
              autoCapitalize="characters"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              placeholder="e.g. ANDHERI1"
              className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white focus:border-brand-500 outline-none tracking-wide"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="4-digit PIN"
              className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white focus:border-brand-500 outline-none tracking-widest"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-semibold text-base hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Log in'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
