'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Header from '../../../../components/Header';
import BottomNav from '../../../../components/BottomNav';
import StateSelectorModal from '../../../../components/StateSelectorModal';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAppState } from '../../../../context/StateContext';

const REASONS = ['new_card', 'add_member', 'update_address', 'lost_card'];
const CONTACT_OPTIONS = [
  { key: 'sms', labelKey: 'form.contactSms', icon: '💬' },
  { key: 'call', labelKey: 'form.contactCall', icon: '📞' },
  { key: 'email', labelKey: 'form.contactEmail', icon: '✉️' },
];
const DOC_OPTIONS = [
  { key: 'id_proof', labelKey: 'form.docIdProof', icon: '🪪' },
  { key: 'address_proof', labelKey: 'form.docAddressProof', icon: '📍' },
  { key: 'photo', labelKey: 'form.docPhoto', icon: '📷' },
  { key: 'birth_cert', labelKey: 'form.docBirthCert', icon: '📄' },
];

const TOTAL_STEPS = 4;

function ApplyFormContent() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { state } = useAppState();
  const type = params.type;

  const draftKey = `ration-draft-${type}`;

  const [step, setStep] = useState(1);
  const [contact, setContact] = useState('sms');
  const [reason, setReason] = useState('');
  const [docs, setDocs] = useState([]);
  const [openWhy, setOpenWhy] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [draftAvailable, setDraftAvailable] = useState(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(draftKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setDraftAvailable(parsed);
        setShowResume(true);
      } catch {
        // ignore corrupt draft
      }
    } else {
      setReason(type && REASONS.includes(type) ? type : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (showResume) return;
    const data = { step, contact, reason, docs };
    window.localStorage.setItem(draftKey, JSON.stringify(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, contact, reason, docs, showResume]);

  function resumeDraft() {
    if (draftAvailable) {
      setStep(draftAvailable.step || 1);
      setContact(draftAvailable.contact || 'sms');
      setReason(draftAvailable.reason || '');
      setDocs(draftAvailable.docs || []);
    }
    setShowResume(false);
  }

  function startFresh() {
    window.localStorage.removeItem(draftKey);
    setStep(1);
    setContact('sms');
    setReason(type && REASONS.includes(type) ? type : '');
    setDocs([]);
    setShowResume(false);
  }

  function toggleDoc(key) {
    setDocs((prev) => (prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]));
  }

  function goNext() {
    setError('');
    if (step === 2 && !reason) {
      setError(t('form.errorReason'));
      return;
    }
    if (step === 3 && docs.length === 0) {
      setError(t('form.errorDocs'));
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function goBack() {
    setError('');
    setStep((s) => Math.max(1, s - 1));
  }

    async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const phone = window.localStorage.getItem('ration_saathi_phone');
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationType: type,
          state,
          phone,
          formData: { contact, reason, documents: docs },
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      const data = await res.json();
      window.localStorage.removeItem(draftKey);
      router.push(`/apply/confirmation/${data.id}`);
    } catch (e) {
      setError('Something went wrong submitting your application. Please try again.');
      setSubmitting(false);
    }
  }

  const progress = (step / TOTAL_STEPS) * 100;

  if (showResume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 max-w-sm w-full animate-popIn text-center">
          <div className="text-4xl mb-3">📝</div>
          <h2 className="font-semibold text-lg mb-1">{t('form.resumeTitle')}</h2>
          <p className="text-sm text-gray-500 mb-5">{t('form.resumeDesc')}</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={resumeDraft}
              className="w-full py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
            >
              {t('form.resumeBtn')}
            </button>
            <button
              onClick={startFresh}
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              {t('form.freshBtn')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ink">
      <Header />
      <StateSelectorModal />

      <main className="max-w-xl mx-auto px-4 py-6 pb-28">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
          <span>
            {t('form.step')} {step} {t('form.of')} {TOTAL_STEPS}
          </span>
          <span>{t(`services.${REASONS.includes(type) ? type : 'new_card'}.title`)}</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

                <div className="bg-white text-gray-900 rounded-2xl border border-gray-100 shadow-sm p-5 animate-fadeIn" key={step}>
          {step === 1 && (
            <div>
              <h2 className="font-semibold text-lg mb-4">{t('form.contactTitle')}</h2>
              <div className="space-y-2">
                {CONTACT_OPTIONS.map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-colors ${
                      contact === opt.key ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="contact"
                      checked={contact === opt.key}
                      onChange={() => setContact(opt.key)}
                      className="accent-brand-600 w-4 h-4"
                    />
                    <span className="text-xl">{opt.icon}</span>
                    <span className="font-medium text-sm">{t(opt.labelKey)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-semibold text-lg mb-4">{t('form.reasonTitle')}</h2>
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-colors ${
                      reason === r ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-brand-600 w-4 h-4"
                    />
                    <span className="font-medium text-sm">{t(`services.${r}.title`)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-semibold text-lg mb-4">{t('form.docsTitle')}</h2>
              <div className="space-y-2">
                {DOC_OPTIONS.map((d) => (
                  <div
                    key={d.key}
                    className={`rounded-xl border-2 transition-colors ${
                      docs.includes(d.key) ? 'border-brand-500 bg-brand-50' : 'border-gray-100'
                    }`}
                  >
                    <label className="flex items-center gap-3 px-4 py-3.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docs.includes(d.key)}
                        onChange={() => toggleDoc(d.key)}
                        className="accent-brand-600 w-4 h-4"
                      />
                      <span className="text-xl">{d.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t(`${d.labelKey}.title`)}</div>
                        <div className="text-xs text-gray-500">{t(`${d.labelKey}.desc`)}</div>
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => setOpenWhy(openWhy === d.key ? null : d.key)}
                      className="text-xs text-brand-600 px-4 pb-3 hover:underline"
                    >
                      {t('form.docsWhy')}
                    </button>
                    {openWhy === d.key && (
                      <div className="px-4 pb-3 text-xs text-gray-500 animate-fadeIn">
                        {t(`${d.labelKey}.why`)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-semibold text-lg mb-4">{t('form.reviewTitle')}</h2>
              <dl className="space-y-3 text-sm">
                <ReviewRow label={t('form.requestType')} value={t(`services.${REASONS.includes(type) ? type : 'new_card'}.title`)} />
                <ReviewRow label={t('form.contactMethod')} value={t(`form.contact${contact.charAt(0).toUpperCase()}${contact.slice(1)}`)} />
                <ReviewRow label={t('form.reason')} value={reason ? t(`services.${reason}.title`) : '—'} />
                <ReviewRow label={t('form.documents')} value={String(docs.length)} />
              </dl>
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 animate-fadeIn">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-5">
          {step > 1 && (
            <button
              onClick={goBack}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              {t('form.back')}
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button
              onClick={goNext}
              className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
            >
              {t('form.next')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
              {submitting ? t('form.submitting') : t('form.submit')}
            </button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export default function ApplyFormPage() {
  return (
    <ProtectedRoute>
      <ApplyFormContent />
    </ProtectedRoute>
  );
}
