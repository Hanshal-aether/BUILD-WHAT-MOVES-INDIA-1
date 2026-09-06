'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function ShopLoginPage() {
  const router = useRouter();
  const [loginCode, setLoginCode] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
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
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ink flex flex-col">
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
