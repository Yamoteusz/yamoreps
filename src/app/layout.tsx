import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommandPalette from '@/components/common/CommandPalette';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});
const space = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-space',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yamoreps.pl';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'YamoREPS — Najlepszy spreadsheet w Polsce',
    template: '%s · YamoREPS',
  },
  description:
    'Wszystko, czego potrzebujesz w jednym miejscu. Baza zweryfikowanych produktów, konwerter linków, galerie QC i tracking dla społeczności reps.',
  keywords: [
    'yamoreps',
    'reps',
    'spreadsheet',
    'qc',
    'pandabuy',
    'kakobuy',
    'mulebuy',
    'sugargoo',
    'taobao',
    '1688',
    'weidian',
  ],
  authors: [{ name: 'YamoREPS' }],
  creator: 'YamoREPS',
  publisher: 'YamoREPS',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: SITE_URL,
    siteName: 'YamoREPS',
    title: 'YamoREPS — Najlepszy spreadsheet w Polsce',
    description:
      'Baza produktów, konwerter linków, galerie QC i tracking. Wszystko w jednym miejscu.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YamoREPS',
    description:
      'Baza produktów, konwerter linków, galerie QC i tracking. Wszystko w jednym miejscu.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#08080c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${inter.variable} ${space.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden">
        <Navbar />
        <main className="relative">{children}</main>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
