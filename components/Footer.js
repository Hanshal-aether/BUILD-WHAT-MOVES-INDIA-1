import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-white/10 mt-10">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Logo size={22} />
          <span className="font-display font-semibold text-gray-700 dark:text-gray-200">Ration Saathi</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="/about" className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors">About</a>
          <a href="/" className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors">Home</a>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-right">
          Built for <span className="font-medium">Build What Moves India</span> · 2026
        </p>
      </div>
    </footer>
  );
}