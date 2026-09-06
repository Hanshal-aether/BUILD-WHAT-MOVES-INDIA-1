'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../../components/Logo';

const PHONE_REGEX = /^[6-9]\d{9}$/;
const CARD_REGEX = /^[A-Z]{2}-\d{4}-\d{4}$/;

export default function LinkCardPage() {
  const router = useRouter();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [household, setHousehold] = useState(null);

  useEffect(() => {
    const flag = window.localStorage.getItem('ration_saathi_logged_in');
    if (flag !== 'true') router.replace('/login');
    const existing = window.localStorage.getItem('ration_saathi_card_number');
    if (existing) router.replace('/');
  }, [router]);

  async function handlePhoneSubmit(e) {
    e.preventDefault();
    setError('');

    if (!PHONE_REGEX.test(phone)) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    try {
      const email = window.localStorage.getItem('ration_saathi_email');
      const res = await fetch('/api/citizen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save your number');

      window.localStorage.setItem('ration_saathi_phone', phone);
      setStep('card');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCardLookup(e) {
    e.preventDefault();
    setError('');

    if (!CARD_REGEX.test(cardNumber.trim().toUpperCase())) {
      setError('Enter a valid card number, like MH-2847-9910');
      return;
    }

    setLoading(true);
    // NOTE: This household preview is mock data (disclosed in the README) —
    // there's no real government PDS database to check against. The card
    // number itself and the phone linkage above ARE saved for real, to the
    // Citizen table in Postgres.
    setTimeout(() => {
      setHousehold({
        cardNumber: cardNumber.trim().toUpperCase(),
        members: ['Arjun Patil (Head)', 'Sunita Patil', 'Rohan Patil'],
      });
      setLoading(false);
    }, 600);
  }

  async function confirmHousehold() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/citizen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, rationCardNumber: household.cardNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save your card');

      window.localStorage.setItem('ration_saathi_card_number', household.cardNumber);
      window.localStorage.setItem('ration_saathi_household', JSON.stringify(household.members));
      router.replace('/');
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

      <div className="relative z-10 w-full max-w-sm animate-fadeIn">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center bg-white rounded-2xl p-3 mb-4 shadow-xl">
            <Logo size={56} />
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            {step === 'phone' ? 'Add your mobile number' : 'Link your ration card'}
          </h1>
          <p className="text-white/70 text-sm mt-2">
            {step === 'phone'
              ? "We'll use this to connect your card and shop bookings"
              : 'One-time step — every service will use this record'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl ring-1 ring-inset ring-white/10">
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/90 mb-1.5">Mobile number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              {error && (
                <div className="text-sm text-red-100 bg-red-500/30 border border-red-300/40 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading && <span className="w-4 h-4 rounded-full border-2 border-brand-300 border-t-brand-700 animate-spin" />}
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 'card' && !household && (
            <form onSubmit={handleCardLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/90 mb-1.5">Ration card number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="MH-2847-9910"
                  className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white font-mono"
                />
              </div>
              {error && (
                <div className="text-sm text-red-100 bg-red-500/30 border border-red-300/40 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-white/90 active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading && <span className="w-4 h-4 rounded-full border-2 border-brand-300 border-t-brand-700 animate-spin" />}
                {loading ? 'Looking up...' : 'Find my household'}
              </button>
            </form>
          )}

          {household && (
            <div className="animate-fadeIn">
              <p className="text-sm text-white/70 mb-3">We found this household:</p>
              <div className="bg-white/90 rounded-xl p-4 mb-4">
                <p className="font-mono text-sm text-gray-500 mb-2">{household.cardNumber}</p>
                {household.members.map((m) => (
                  <p key={m} className="text-gray-900 text-sm py-1 border-b border-gray-100 last:border-0">
                    {m}
                  </p>
                ))}
              </div>
              {error && (
                <div className="text-sm text-red-100 bg-red-500/30 border border-red-300/40 rounded-xl px-3 py-2 mb-3">
                  {error}
                </div>
              )}
              <button
                onClick={confirmHousehold}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-ink font-semibold transition-all disabled:opacity-70"
              >
                {loading ? 'Saving...' : 'Yes, this is my household'}
              </button>
              <button
                onClick={() => { setHousehold(null); setCardNumber(''); }}
                className="w-full text-center text-xs text-white/60 hover:text-white/90 mt-3"
              >
                That's not right, try another number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}