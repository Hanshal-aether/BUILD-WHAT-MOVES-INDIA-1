'use client';

import Logo from '../components/Logo';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { landingText } from '../lib/landing-i18n';

// Thin tricolor accent bar instead of a flag emoji — emoji flags render as
// bare "IN" letters on Windows Chrome (no color flag glyphs on that
// platform), which is exactly the bug that kept showing up. An actual
// striped bar can't break like that on any OS.
function TricolorBar({ className = '' }) {
  return (
    <div className={`flex h-1.5 w-14 rounded-full overflow-hidden ${className}`}>
      <div className="flex-1 bg-saffron-500" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-emerald-600" />
    </div>
  );
}

export default function LandingPage() {
  const { lang, toggleLang, langLabel } = useLanguage();
  const text = landingText[lang] || landingText.en;

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-ink">
      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 font-semibold text-ink dark:text-white">
          <Logo size={36} />
          <span className="font-display text-lg tracking-tight">Ration Saathi</span>
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-sm font-medium px-4 py-2 rounded-full border border-brand-200 dark:border-white/15 bg-white/80 dark:bg-white/5 dark:text-gray-200 hover:bg-brand-50 dark:hover:bg-white/10 hover:border-brand-400 transition-all"
          >
            {langLabel}
          </button>
          <a
            href="/login"
            className="text-sm font-semibold px-5 py-2.5 rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            {text.ctaPrimary}
          </a>
        </div>
      </header>

      {/* Hero — one big, confident statement, lots of room to breathe */}
      <section className="relative overflow-hidden bg-ink bg-grain">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600" />
        <div className="absolute -top-32 -right-20 w-[28rem] h-[28rem] bg-saffron-500/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-[28rem] h-[28rem] bg-brand-400/30 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-28 sm:pt-28 sm:pb-36 text-center">
          <TricolorBar className="mx-auto mb-7" />
          <p className="text-white/60 text-sm font-medium tracking-wide mb-6">{text.badge}</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white leading-[1.05] mb-7">
            {text.heroTitle}
          </h1>
          <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            {text.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-saffron-500 text-ink font-semibold text-base hover:bg-saffron-400 transition-colors shadow-lg shadow-saffron-500/20"
            >
              {text.ctaPrimary}
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/25 text-white font-medium text-base hover:bg-white/10 transition-colors"
            >
              {text.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6">
        {/* The problem — one drop-cap accent, used once, deliberately */}
        <section className="py-14 sm:py-20 border-b border-gray-200/70 dark:border-white/10">
          <p className="text-brand-600 dark:text-saffron-400 font-medium text-sm mb-5">{text.problemEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-10 max-w-2xl">
            {text.problemHeading}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 max-w-2xl">
            {lang === 'en' ? (
              <>
                <span className="float-left text-6xl sm:text-7xl font-display font-bold text-saffron-500 leading-[0.85] pr-3 pt-1">
                  {text.problemBody.charAt(0)}
                </span>
                {text.problemBody.slice(1)}
              </>
            ) : (
              text.problemBody
            )}
          </p>
          <a
            href="/about"
            className="clear-left inline-flex items-center gap-1.5 text-base font-medium text-brand-600 dark:text-brand-300 hover:underline"
          >
            {text.problemLink} →
          </a>
        </section>

        {/* Features — flowing hairline-divided rows, not boxed cards */}
        <section id="how-it-works" className="py-14 sm:py-20 border-b border-gray-200/70 dark:border-white/10 scroll-mt-6">
          <p className="text-brand-600 dark:text-saffron-400 font-medium text-sm mb-5">{text.featuresEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6 max-w-2xl">
            {text.featuresHeading}
          </h2>
          <div>
            <FeatureRow icon="📱" title={text.feature1Title} desc={text.feature1Desc} />
            <FeatureRow icon="🔍" title={text.feature2Title} desc={text.feature2Desc} />
            <FeatureRow icon="🏪" title={text.feature3Title} desc={text.feature3Desc} />
            <FeatureRow icon="🗣️" title={text.feature4Title} desc={text.feature4Desc} last />
          </div>
        </section>

        {/* Built for real villages — same flowing treatment */}
        <section className="py-14 sm:py-20">
          <p className="text-brand-600 dark:text-saffron-400 font-medium text-sm mb-5">{text.villageEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6 max-w-2xl">
            {text.villageHeading}
          </h2>
          <div>
            <FeatureRow icon="1️⃣" title={text.village1Title} desc={text.village1Desc} />
            <FeatureRow icon="2️⃣" title={text.village2Title} desc={text.village2Desc} />
            <FeatureRow icon="3️⃣" title={text.village3Title} desc={text.village3Desc} last />
          </div>
        </section>
      </main>

      {/* Final CTA */}
      <section className="bg-ink bg-grain relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600" />
        <div className="relative max-w-2xl mx-auto px-6 py-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">{text.finalHeading}</h2>
          <p className="text-white/70 text-lg mb-9">{text.finalSub}</p>
          <a
            href="/login"
            className="inline-block px-9 py-4 rounded-full bg-saffron-500 text-ink font-semibold text-base hover:bg-saffron-400 transition-colors shadow-lg shadow-saffron-500/20"
          >
            {text.finalCta}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureRow({ title, desc, icon, last = false }) {
  return (
    <div className={`py-6 sm:py-8 border-t border-gray-200/70 dark:border-white/15 flex gap-4 sm:gap-5 ${last ? 'border-b' : ''}`}>
      {icon && (
        <div className="text-3xl sm:text-4xl shrink-0 w-10 sm:w-12 text-center">{icon}</div>
      )}
      <div>
        <div className="font-display font-bold text-gray-900 dark:text-white text-xl sm:text-2xl leading-tight mb-2 max-w-2xl">
          {title}
        </div>
        <div className="text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{desc}</div>
      </div>
    </div>
  );
}
