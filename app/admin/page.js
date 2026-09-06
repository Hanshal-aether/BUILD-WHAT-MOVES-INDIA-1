'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const STATUSES = ['new', 'submitted', 'under_review', 'needs_correction', 'approved'];

export default function AdminPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState('under_review');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/applications');
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submitUpdate(id) {
    setSaving(true);
    try {
      await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note, changedBy: 'officer' }),
      });
      setActiveId(null);
      setNote('');
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-ink flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 pb-16">
        <div className="mb-4">
          <h1 className="text-xl font-display font-bold dark:text-white">Verification Officer Console</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Demo view of the review workflow — flag a specific issue and the citizen sees the exact reason and a timeline in their Status tab.
          </p>
        </div>

        {loading && <div className="text-center text-sm text-gray-400 py-8">Loading…</div>}

        <div className="space-y-2">
          {apps.map((app) => {
            let formData = {};
            try {
              formData = JSON.parse(app.formData || '{}');
            } catch {
              formData = {};
            }
            const isActive = activeId === app.id;
            return (
              <div key={app.id} className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {app.applicationType} · {app.citizen?.name || app.citizen?.phone}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      RS-{app.id.replace(/-/g, '').slice(-8).toUpperCase()} · {app.citizen?.phone}
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {app.status}
                  </span>
                </div>

                {!isActive ? (
                  <button
                    onClick={() => {
                      setActiveId(app.id);
                      setStatus(app.status === 'new' ? 'under_review' : app.status);
                      setNote('');
                    }}
                    className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-white/10 text-brand-700 dark:text-brand-200 font-medium hover:bg-brand-100 dark:hover:bg-white/15"
                  >
                    Review
                  </button>
                ) : (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10 space-y-2">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={
                        status === 'needs_correction'
                          ? 'Be specific — e.g. "Address proof photo is blurry, please re-upload"'
                          : 'Optional note for the citizen'
                      }
                      className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => submitUpdate(app.id)}
                        disabled={saving}
                        className="flex-1 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
                      >
                        {saving ? 'Saving…' : 'Save update'}
                      </button>
                      <button
                        onClick={() => setActiveId(null)}
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
