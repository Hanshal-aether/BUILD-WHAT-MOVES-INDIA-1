'use client';

import Logo from '../components/Logo';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { landingText } from '../lib/landing-i18n';

export default function LandingPage() {
  const { lang, toggleLang, langLabel } = useLanguage();
  const text = landingText[lang] || landingText.en;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-ink">
      <header className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-semibold text-ink dark:text-white">
          <Logo size={30} />
          <span className="font-display tracking-tight">Ration Saathi</span>
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-sm font-medium px-3 py-1.5 rounded-full border border-brand-200 dark:border-white/15 bg-white/80 dark:bg-white/5 dark:text-gray-200 hover:bg-brand-50 dark:hover:bg-white/10 hover:border-brand-400 transition-all"
          >
            {langLabel}
          </button>
          <a
            href="/login"
            className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            {text.ctaPrimary}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink bg-grain mt-2">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600" />
        <div className="absolute -top-20 -right-10 w-72 h-72 bg-saffron-500/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-brand-400/30 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-20 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-saffron-400 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-5">
            🇮🇳 {text.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white leading-tight mb-4">
            {text.heroTitle}
          </h1>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            {text.heroSubtitle}
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/login"
              className="px-6 py-3 rounded-full bg-saffron-500 text-ink font-semibold text-sm hover:bg-saffron-400 transition-colors shadow-lg shadow-saffron-500/20"
            >
              {text.ctaPrimary}
            </a>
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-full border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors"
            >
              {text.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4">
        {/* The problem */}
        <section className="py-14 border-b border-gray-100 dark:border-white/10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-brand-600 dark:text-saffron-400 bg-brand-50 dark:bg-white/10 border border-brand-100 dark:border-white/15 rounded-full px-3 py-1 mb-4">
            {text.problemEyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-4">
            {text.problemHeading}
          </h2>
          <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{text.problemBody}</p>
          <a href="/about" className="text-sm font-medium text-brand-600 dark:text-brand-300 hover:underline">
            {text.problemLink} →
          </a>
        </section>

        {/* Features */}
        <section id="how-it-works" className="py-14 border-b border-gray-100 dark:border-white/10 scroll-mt-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-brand-600 dark:text-saffron-400 bg-brand-50 dark:bg-white/10 border border-brand-100 dark:border-white/15 rounded-full px-3 py-1 mb-4">
            {text.featuresEyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-8">
            {text.featuresHeading}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FeatureCard icon="📱" title={text.feature1Title} desc={text.feature1Desc} />
            <FeatureCard icon="🔍" title={text.feature2Title} desc={text.feature2Desc} />
            <FeatureCard icon="🏪" title={text.feature3Title} desc={text.feature3Desc} />
            <FeatureCard icon="🗣️" title={text.feature4Title} desc={text.feature4Desc} />
          </div>
        </section>

        {/* Built for real villages */}
        <section className="py-14">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-brand-600 dark:text-saffron-400 bg-brand-50 dark:bg-white/10 border border-brand-100 dark:border-white/15 rounded-full px-3 py-1 mb-4">
            {text.villageEyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-8">
            {text.villageHeading}
          </h2>
          <div className="space-y-5">
            <VillagePoint number="1" title={text.village1Title} desc={text.village1Desc} />
            <VillagePoint number="2" title={text.village2Title} desc={text.village2Desc} />
            <VillagePoint number="3" title={text.village3Title} desc={text.village3Desc} />
          </div>
        </section>
      </main>

      {/* Final CTA */}
      <section className="bg-ink bg-grain relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600" />
        <div className="relative max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">{text.finalHeading}</h2>
          <p className="text-white/70 text-sm mb-7">{text.finalSub}</p>
          <a
            href="/login"
            className="inline-block px-7 py-3 rounded-full bg-saffron-500 text-ink font-semibold text-sm hover:bg-saffron-400 transition-colors shadow-lg shadow-saffron-500/20"
          >
            {text.finalCta}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-5 shadow-soft">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">{title}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</div>
    </div>
  );
}

function VillagePoint({ number, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-saffron-500 text-ink font-display font-bold text-sm flex items-center justify-center">
        {number}
      </div>
      <div>
        <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">{title}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}
