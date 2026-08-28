import './globals.css';
import { Sora, Inter } from 'next/font/google';
import { LanguageProvider } from '../context/LanguageContext';
import { StateProvider } from '../context/StateContext';
import { ThemeProvider } from '../context/ThemeContext';
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
  title: 'Ration Saathi — Ration card services, simplified',
  description:
    'Apply for, track, and manage your ration card online. Phone-only login, no Aadhar required.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="bg-gray-50 dark:bg-ink text-gray-900 dark:text-gray-100 antialiased font-body transition-colors">
        <ThemeProvider>
          <LanguageProvider>
            <StateProvider>{children}</StateProvider>
          </LanguageProvider>
                </ThemeProvider>
        <FAQWidget />
      </body>
    </html>
  );
}
