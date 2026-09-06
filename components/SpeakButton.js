'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Uses the device's built-in speech synthesis — no network call, no API
// cost, and it works on the cheap Android phones that are actually common
// in tier-3 towns and villages. This is aimed squarely at citizens who
// can't comfortably read the English or even the Hindi text on screen.
export default function SpeakButton({ text, className = '' }) {
  const { lang } = useLanguage();
  const [speaking, setSpeaking] = useState(false);

  function speak() {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={speaking ? 'Stop reading aloud' : 'Read aloud'}
      className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${
        speaking
          ? 'bg-brand-600 text-white border-brand-600'
          : 'bg-white/10 border-white/20 text-current hover:bg-white/20'
      } ${className}`}
    >
      {speaking ? '⏸️ Stop' : '🔊 Listen'}
    </button>
  );
}
