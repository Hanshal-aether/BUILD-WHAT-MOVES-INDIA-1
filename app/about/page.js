'use client';

import Logo from '../../components/Logo';
import Footer from '../../components/Footer';
import { useLanguage } from '../../context/LanguageContext';
import { aboutText } from '../../lib/about-i18n';

export default function AboutPage() {
  const { lang, toggleLang } = useLanguage();
  const text = aboutText[lang] || aboutText.en;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ink">
      <header className="border-b border-gray-100 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-semibold text-ink dark:text-white">
            <Logo size={30} />
            <span className="font-display tracking-tight">Ration Saathi</span>
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="text-sm font-medium px-3 py-1.5 rounded-full border border-brand-200 dark:border-white/15 bg-white/80 dark:bg-white/5 dark:text-gray-200 hover:bg-brand-50 dark:hover:bg-white/10 hover:border-brand-400 transition-all"
            >
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>
            <a href="/login" className="text-sm text-brand-600 dark:text-brand-300 font-medium hover:underline">
              {text.openApp}
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-14">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-brand-600 dark:text-saffron-400 bg-brand-50 dark:bg-white/10 border border-brand-100 dark:border-white/15 rounded-full px-3 py-1 mb-4">
          {text.badge}
        </span>
        <p className="text-base text-gray-500 dark:text-gray-400 mb-4">{text.intro}</p>
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-6">
          {text.heading}
        </h1>

        <div className="space-y-5 text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed">
          <p>{text.para1}</p>
          <p>{text.para2}</p>
          <p>{text.para3}</p>
          <p>{text.para4}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-12">
          <ValueCard icon="📱" title={text.card1Title} desc={text.card1Desc} />
          <ValueCard icon="🔍" title={text.card2Title} desc={text.card2Desc} />
          <ValueCard icon="🏪" title={text.card3Title} desc={text.card3Desc} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-soft">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">{title}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{desc}</div>
    </div>
  );
}