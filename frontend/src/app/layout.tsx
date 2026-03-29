import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from './providers';

export const metadata: Metadata = {
  title: 'Amboras Analytics Dashboard',
  description: 'Real-time store analytics for eCommerce store owners. Track revenue, conversions, top products, and customer activity.',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
