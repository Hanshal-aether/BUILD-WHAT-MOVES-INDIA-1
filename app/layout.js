import './globals.css';
import { Sora, Inter } from 'next/font/google';
import { LanguageProvider } from '../context/LanguageContext';
import { StateProvider } from '../context/StateContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AccessibilityProvider } from '../context/AccessibilityContext';
import FAQWidget from '../components/FAQWidget';

const sora = Sora({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: "Ration Saathi — Ration Card Services, Simplified",
  description:
    "Explore Ration Saathi, a hackathon-built prototype for ration card application tracking, fair price shop slot booking, and accessible services in India.",
  alternates: {
    canonical: "https://ration-saathi-lime.vercel.app/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="bg-cream-50 dark:bg-ink text-gray-900 dark:text-gray-100 antialiased font-body transition-colors">
        <ThemeProvider>
          <AccessibilityProvider>
            <LanguageProvider>
              <StateProvider>{children}</StateProvider>
            </LanguageProvider>
          </AccessibilityProvider>
        </ThemeProvider>
        <FAQWidget />
      </body>
    </html>
  );
}
