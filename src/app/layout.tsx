import Navbar from '@/components/Navbar';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'BlogHub',
  description: 'A blog application with user management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}