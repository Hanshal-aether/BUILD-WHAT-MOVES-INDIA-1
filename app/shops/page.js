'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import StateSelectorModal from '../../components/StateSelectorModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAppState } from '../../context/StateContext';

function formatDateLabel(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  if (sameDay(date, today)) return 'Today';
  if (sameDay(date, tomorrow)) return 'Tomorrow';
  return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

function ShopsContent() {
  const { t } = useLanguage();
  const { state, isPilot } = useAppState();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeShop, setActiveShop] = useState(null);
  const [booking, setBooking] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!isPilot) {
      setLoading(false);
      return;
    }
    fetch('/api/shops')
      .then((res) => res.json())
      .then((data) => setShops(Array.isArray(data) ? data : []))
      .catch(() => setShops([]))
      .finally(() => setLoading(false));
  }, [isPilot]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

    async function bookSlot(shop, slot) {
    const phone = window.localStorage.getItem('ration_saathi_phone') || 'guest';
    const bookingKey = `ration_saathi_active_booking_${phone}`;

    const activeRaw = window.localStorage.getItem(bookingKey);
    if (activeRaw) {
      try {
        const active = JSON.parse(activeRaw);
        if (active.slotId !== slot.id) {
          const proceed = window.confirm(
            `You already have a slot booked at ${active.shopName} on ${active.date}, ${active.time}. Book this new slot anyway?`
          );
          if (!proceed) return;
        }
      } catch {
        // ignore corrupt stored booking
      }
    }

    setBooking(slot.id);
    try {
      const res = await fetch(`/api/timeslots/${slot.id}/book`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to book');
      }
      setShops((prev) =>
        prev.map((s) =>
          s.id === shop.id ? { ...s, timeSlots: s.timeSlots.filter((sl) => sl.id !== slot.id) } : s
        )
      );
      setActiveShop(null);
      const bookedInfo = {
        shopId: shop.id,
        shopName: shop.name,
        slotId: slot.id,
        date: formatDateLabel(slot.date),
        time: `${slot.startTime} - ${slot.endTime}`,
      };
      window.localStorage.setItem(bookingKey, JSON.stringify(bookedInfo));
      setNotice(bookedInfo);
    } catch (e) {
      setNotice({ error: e.message || 'Something went wrong. Please try again.' });
    } finally {
      setBooking(null);
    }
  }

  if (!isPilot) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-ink">
        <Header />
        <StateSelectorModal />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center animate-fadeIn">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{t('shops.comingSoonTitle')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('shops.comingSoonSub')(state)}</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ink">
      <Header />
      <StateSelectorModal />

      {notice && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-auto animate-fadeIn">
          {notice.error ? (
            <div className="flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-xl">
              ⚠️ {notice.error}
              <button onClick={() => setNotice(null)} className="ml-2 opacity-80 hover:opacity-100">✕</button>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-ink text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10">
              <span className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center text-ink shrink-0">✓</span>
              <div className="text-sm leading-snug">
                <div className="font-semibold">Your slot is booked!</div>
                <div className="text-white/70">{notice.shop} · {notice.date}, {notice.time}</div>
              </div>
              <button onClick={() => setNotice(null)} className="ml-2 opacity-60 hover:opacity-100">✕</button>
            </div>
          )}
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
        <div className="mb-6 animate-fadeIn">
          <h1 className="text-2xl font-display font-bold tracking-tight dark:text-white">{t('shops.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{state}</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulseSoft" />
            ))}
          </div>
        )}

        {!loading && shops.length === 0 && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="text-5xl mb-3">🏪</div>
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">{t('shops.empty')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('shops.emptySub')(state)}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shops.map((shop, i) => (
            <div
              key={shop.id}
              className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden hover:border-brand-300 dark:hover:border-brand-400 hover:shadow-lg transition-all animate-fadeIn"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="h-36 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-white/10 dark:to-white/5 flex items-center justify-center">
                <img src={shop.image} alt={shop.name} className="h-20 opacity-90" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">📍 {shop.address}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">⏰ {t('shops.hours')}</p>

                <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs text-gray-600 dark:text-gray-300">
                  <div className="bg-gray-50 dark:bg-white/10 rounded-lg py-1.5">🍚 Rice</div>
                  <div className="bg-gray-50 dark:bg-white/10 rounded-lg py-1.5">🌾 Wheat</div>
                  <div className="bg-gray-50 dark:bg-white/10 rounded-lg py-1.5">🥄 Sugar</div>
                </div>

                <button
                  onClick={() => setActiveShop(shop)}
                  className="w-full py-2.5 rounded-lg bg-brand-50 dark:bg-white/10 text-brand-700 dark:text-brand-200 font-medium text-sm hover:bg-brand-100 dark:hover:bg-white/15 transition-colors flex items-center justify-center gap-1.5"
                >
                  {shop.timeSlots.length > 0
                    ? `${t('shops.bookSlot')} · ${shop.timeSlots.length} open`
                    : 'No slots left'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {activeShop && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fadeIn"
          onClick={() => setActiveShop(null)}
        >
          <div
            className="bg-white dark:bg-brand-900 w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{activeShop.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pick an available slot</p>
              </div>
              <button
                onClick={() => setActiveShop(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-4">
              {activeShop.timeSlots.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No available slots right now — check back soon.
                </p>
              )}

              {Object.entries(
                activeShop.timeSlots.reduce((acc, slot) => {
                  (acc[slot.date] = acc[slot.date] || []).push(slot);
                  return acc;
                }, {})
              ).map(([date, slots]) => (
                <div key={date}>
                  <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                    {formatDateLabel(date)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        disabled={booking === slot.id}
                        onClick={() => bookSlot(activeShop, slot)}
                        className="px-3 py-2.5 rounded-xl border-2 border-gray-100 dark:border-white/10 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-white/10 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {booking === slot.id && (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-brand-300 border-t-brand-600 animate-spin" />
                        )}
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function ShopsPage() {
  return (
    <ProtectedRoute>
      <ShopsContent />
    </ProtectedRoute>
  );
}
