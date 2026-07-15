import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Heineken Innovation Apps Portal',
  description: 'Shortcuts to Heineken innovation apps and tools.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-heineken-cream text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
