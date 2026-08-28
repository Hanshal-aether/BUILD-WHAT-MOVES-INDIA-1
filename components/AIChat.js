'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function AIChat() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', text: t('chat.greeting') }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  async function sendMessage(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text) return;
    setError(false);
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error('Request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      setMessages((prev) => [...prev, { role: 'assistant', text: '' }]);

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', text: assistantText };
          return copy;
        });
      }
    } catch (e) {
      setError(true);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-40 right-4 sm:right-6 bottom-20 sm:bottom-6 w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-transform"
        aria-label="AI Assistant"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="fixed z-40 right-3 left-3 sm:left-auto sm:right-6 bottom-36 sm:bottom-24 sm:w-96 h-[28rem] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fadeIn">
          <div className="px-4 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white flex items-center justify-between shrink-0">
            <span className="font-medium text-sm">{t('chat.title')}</span>
            <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100">✕</button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed animate-slideIn ${
                  m.role === 'user'
                    ? 'ml-auto bg-brand-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 w-fit text-sm text-gray-400 flex gap-1">
                <span className="animate-pulseSoft">●</span>
                <span className="animate-pulseSoft" style={{ animationDelay: '0.2s' }}>●</span>
                <span className="animate-pulseSoft" style={{ animationDelay: '0.4s' }}>●</span>
              </div>
            )}
            {error && (
              <div className="text-sm text-red-600 flex items-center gap-2">
                {t('chat.error')}
                <button
                  onClick={() => sendMessage(messages[messages.length - 2]?.text)}
                  className="underline font-medium"
                >
                  {t('chat.retry')}
                </button>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-2.5 border-t border-gray-100 flex items-center gap-2 shrink-0 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="flex-1 px-3 py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              {t('chat.send')}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
