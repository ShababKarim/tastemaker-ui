import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tastemaker',
  description: 'Food & drink journal to track and share your favorite spots and dishes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="cupcake" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-base-100 text-base-content">
        <Navbar />
        <LoginModal />
        <main className="min-h-screen bg-base-200 p-4 md:p-8 font-sans">{children}</main>
      </body>
    </html>
  );
}
