'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const STATUS_STYLES = {
  booked: { label: 'Booked', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300', icon: '🕒' },
  checked_in: { label: 'Checked in', badge: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300', icon: '✓' },
  no_show: { label: 'No-show', badge: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300', icon: '—' },
  open: { label: 'Open', badge: 'bg-gray-50 text-gray-400 dark:bg-white/5 dark:text-gray-500', icon: '' },
};

function dateOptions() {
  const opts = [];
  for (let d = 0; d < 3; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const value = date.toISOString().slice(0, 10);
    const label = d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    opts.push({ value, label });
  }
  return opts;
}

export default function ShopDashboardPage() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [date, setDate] = useState(dateOptions()[0].value);
  const [data, setData] = useState({ bookings: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [lookup, setLookup] = useState('');
  const [lookupMsg, setLookupMsg] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const raw = window.localStorage.getItem('ration_saathi_shop');
    if (!raw) {
      router.replace('/shops/login');
      return;
    }
    setShop(JSON.parse(raw));
  }, [router]);

  const loadBookings = useCallback(async () => {
    if (!shop) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/shops/${shop.id}/bookings?date=${date}`);
      const json = await res.json();
      setData(json.bookings ? json : { bookings: [], summary: {} });
    } catch {
      setData({ bookings: [], summary: {} });
    } finally {
      setLoading(false);
    }
  }, [shop, date]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function markBooking(slotId, action) {
    setBusyId(slotId);
    try {
      const res = await fetch(`/api/shops/${shop.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: data.bookings.find((b) => b.id === slotId)?.bookingCode,
          action,
        }),
      });
      if (res.ok) await loadBookings();
    } finally {
      setBusyId(null);
    }
  }

  async function handleLookup(e) {
    e.preventDefault();
    setLookupMsg(null);
    const query = lookup.trim();
    if (!query) return;
    const isCode = query.toUpperCase().startsWith('RS-');
    try {
      const res = await fetch(`/api/shops/${shop.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isCode ? { code: query } : { phone: query }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLookupMsg({ error: json.error || 'Not found' });
        return;
      }
      setLookupMsg({ success: `Checked in: ${json.citizenName || json.citizenPhone}` });
      setLookup('');
      loadBookings();
    } catch {
      setLookupMsg({ error: 'Something went wrong' });
    }
  }

  function logout() {
    window.localStorage.removeItem('ration_saathi_shop');
    router.push('/shops/login');
  }

  if (!shop) return null;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-ink flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-16">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-display font-bold dark:text-white">{shop.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{shop.address}</p>
          </div>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15"
          >
            Log out
          </button>
        </div>

        {/* Walk-up lookup — no code visible on a phone? just ask for the number */}
        <form onSubmit={handleLookup} className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 p-4 mb-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Verify a walk-up citizen (booking code or phone number)
          </label>
          <div className="flex gap-2">
            <input
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              placeholder="RS-4K7A29 or 9876543210"
              className="flex-1 px-3 py-2.5 rounded-lg border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white focus:border-brand-500 outline-none"
            />
            <button type="submit" className="px-4 py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700">
              Check in
            </button>
          </div>
          {lookupMsg?.error && <p className="text-sm text-red-600 dark:text-red-300 mt-2">⚠️ {lookupMsg.error}</p>}
          {lookupMsg?.success && <p className="text-sm text-green-600 dark:text-green-300 mt-2">✓ {lookupMsg.success}</p>}
        </form>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {dateOptions().map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDate(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                date === opt.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 py-3">
            <div className="text-lg font-bold dark:text-white">{data.summary.booked || 0}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Booked</div>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 py-3">
            <div className="text-lg font-bold dark:text-white">{data.summary.checked_in || 0}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Arrived</div>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 py-3">
            <div className="text-lg font-bold dark:text-white">{data.summary.no_show || 0}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">No-show</div>
          </div>
        </div>

        {loading && <div className="text-center text-sm text-gray-400 py-8">Loading…</div>}

        {!loading && data.bookings.filter((b) => b.status !== 'open').length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">No bookings for this day yet.</div>
        )}

        <div className="space-y-2">
          {data.bookings
            .filter((b) => b.status !== 'open')
            .map((b) => {
              const style = STATUS_STYLES[b.status] || STATUS_STYLES.open;
              return (
                <div key={b.id} className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {b.citizenName || 'Unnamed citizen'} · {b.citizenPhone}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">{b.bookingCode}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{b.startTime} - {b.endTime}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${style.badge}`}>{style.icon} {style.label}</span>
                    {b.status === 'booked' && (
                      <>
                        <button
                          disabled={busyId === b.id}
                          onClick={() => markBooking(b.id, 'checked_in')}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 font-medium hover:bg-green-100 dark:hover:bg-green-500/20"
                        >
                          Check in
                        </button>
                        <button
                          disabled={busyId === b.id}
                          onClick={() => markBooking(b.id, 'no_show')}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/15"
                        >
                          No-show
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
