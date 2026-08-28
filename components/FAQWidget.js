'use client';

import { useState } from 'react';

const FAQS = [
  { q: 'How do I apply for a ration card?', a: 'Tap "Apply" from the home screen, pick what you need (new card, add a family member, update address, or replace a lost card), and follow the 4-step form. It takes about 2 minutes.' },
  { q: 'What documents do I need?', a: 'Usually an identification document, address proof, a recent photograph, and — if adding a family member — a birth certificate. The app tells you exactly which ones apply.' },
  { q: 'How long does approval take?', a: 'Most applications are reviewed within 3-5 working days. Track live status any time from the "Status" tab.' },
  { q: 'What if my application needs correction?', a: 'You\'ll see a "Needs correction" badge on the Status page with the issue explained. Tap "Resubmit" to fix and send it again.' },
  { q: 'How do fair price shop bookings work?', a: 'Open "Shops", tap any shop to see its open time slots, and pick one. Your slot is reserved immediately with an on-screen confirmation.' },
  { q: 'Do you collect my Aadhar number?', a: 'No. Ration Saathi only ever asks for your mobile number — no Aadhar or other government ID is collected.' },
  { q: 'Which states are supported?', a: 'Maharashtra is live as our pilot state with real fair price shop data. Other states show "Coming soon" as we expand.' },
  { q: 'Can I use this in Hindi?', a: 'Yes — tap the EN / हिं toggle in the header to switch the whole app\'s language instantly.' },
];

export default function FAQWidget() {
  const [open, setOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-40 right-4 sm:right-6 bottom-20 sm:bottom-6 w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-transform"
        aria-label="Help and FAQs"
      >
        {open ? '✕' : '❓'}
      </button>

      {open && (
        <div className="fixed z-40 right-3 left-3 sm:left-auto sm:right-6 bottom-36 sm:bottom-24 sm:w-96 max-h-[28rem] bg-white dark:bg-brand-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden animate-fadeIn text-gray-900 dark:text-gray-100">
          <div className="px-4 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white flex items-center justify-between shrink-0">
            <span className="font-medium text-sm">Help & FAQs</span>
            <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {FAQS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} className="border-b border-gray-100 dark:border-white/10 last:border-0">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-2 text-left px-2 py-3 text-sm font-medium hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                  >
                    {item.q}
                    <span className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {isOpen && (
                    <p className="px-2 pb-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed animate-fadeIn">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}