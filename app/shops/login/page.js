'use client';

import { useState, Suspense } from 'react';
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

  // Signed magic link: /shops/login?shop=ANDHERI1&exp=<timestamp>&sig=<hmac>
  // The PIN is never present in the URL — sig is a signed proof that expires,
  // so an old/leaked link stops working and never reveals the real PIN.
  const shopParam = searchParams.get('shop');
  const expParam = searchParams.get('exp');
  const sigParam = searchParams.get('sig');
  const hasTokenLink = Boolean(shopParam && expParam && sigParam);
  const [tokenState, setTokenState] = useState(hasTokenLink ? 'pending' : null);

  async function handleManualSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/shops/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginCode, pin }),
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
    }
  }

  async function confirmTokenLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/shops/auth-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shop: shopParam, exp: expParam, sig: sigParam }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTokenState('invalid');
        setError(data.error || 'This link is invalid or has expired.');
        return;
      }
      window.localStorage.setItem('ration_saathi_shop', JSON.stringify(data));
      router.push('/shops/dashboard');
    } catch {
      setTokenState('invalid');
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (hasTokenLink) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-ink flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-4xl">🏪</div>
        {tokenState === 'pending' && (
          <>
            <h1 className="text-lg font-display font-bold dark:text-white">
              Log in as {shopParam}?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              This is a saved shop link. If this isn't your shop, close this page instead.
            </p>
            {error && (
              <div className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg px-3 py-2">
                ⚠️ {error}
              </div>
            )}
            <button
              onClick={confirmTokenLogin}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Checking…' : 'Yes, log me in'}
            </button>
          </>
        )}
        {tokenState === 'invalid' && (
          <>
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            <button
              onClick={() => setTokenState(null)}
              className="text-sm underline text-brand-600 dark:text-brand-300"
            >
              Enter shop code and PIN manually instead
            </button>
          </>
        )}
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

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shop code</label>
            <input
              type="text"
              autoCapitalize="characters"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              placeholder="e.g. SHOP ID"
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