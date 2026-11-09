import type { Metadata } from 'next';
import { Fredoka, Nunito_Sans, Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const fredoka = Fredoka({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
});

const nunitoSans = Nunito_Sans({
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Pawthik (Paw-থিক) — Know exactly where your pet is. Down to the tree.',
  description:
    'Pawthik (Paw-থিক) is an independent 4G GPS tracking collar and community animal welfare platform that puts live location on your phone. Safe zones, route history, live audio chime, zero monthly subscription fees.',
  keywords: [
    'pawthik',
    'paw-থিক',
    'pet tracker',
    'dog gps collar',
    'cat tracker',
    'street animal welfare',
    'safe zones',
    '4g pet tracker',
  ],
  openGraph: {
    title: 'Pawthik (Paw-থিক) — Know exactly where your pet is. Down to the tree.',
    description:
      'Independent 4G tracking collar with zero monthly subscription fees. Safe Zones from 100m to 3km, satellite positioning, cellular delivery.',
    type: 'website',
    siteName: 'Pawthik',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${nunitoSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body text-[#000000] bg-[#EEF1EA]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
