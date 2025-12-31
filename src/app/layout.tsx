import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';

export const metadata: Metadata = {
  title: 'Tastemaker',
  description: 'Food & drink journal to track and share your favorite spots and dishes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="cupcake">
      <body className="min-h-screen bg-base-100 text-base-content">
        <Navbar />
        <LoginModal />
        <main className="min-h-screen bg-base-200 p-4 md:p-8">{children}</main>
      </body>
    </html>
  );
}
