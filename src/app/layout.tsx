import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import Navbar from '@/components/Navbar/Navbar';

const inter = Inter({ subsets: ['latin'] });

// 1. VIEWPORT SETTINGS (Critical for Mobile SEO)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030014',
};

// 2. METADATA (Critical for Search Engines)
export const metadata: Metadata = {
  title: 'ApniSec - Cyber Security Issue Tracking Dashboard',
  description: 'A secure, real-time dashboard for tracking vulnerabilities, VAPT reports, and cloud security issues. Built for security professionals.',
  keywords: ['Cyber Security', 'Bug Tracker', 'VAPT', 'Dashboard', 'ApniSec'],
  authors: [{ name: 'Rahul Vakiti' }],
  openGraph: {
    title: 'ApniSec Dashboard',
    description: 'Secure Issue Tracking System',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}