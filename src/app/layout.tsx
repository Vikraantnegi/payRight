import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TaxProvider } from '@/lib/TaxContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Pay Right | Tax Calculator - Compare Old vs New Tax Regime',
  description:
    'Calculate your income tax under both Old and New Tax Regime for AY 2026-27. Compare tax savings, find optimal regime, and plan your deductions with our comprehensive tax calculator.',
  keywords:
    'Pay Right, tax calculator, old tax regime, new tax regime, income tax calculation, 80C deductions, HRA exemption, tax planning, AY 2026-27, FY 2025-26',
  authors: [{ name: 'Pay Right Team' }],
  openGraph: {
    title: 'Pay Right | Tax Calculator - Compare Old vs New Tax Regime',
    description:
      'Calculate your income tax under both Old and New Tax Regime for AY 2026-27. Compare tax savings and find optimal regime.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pay Right | Tax Calculator - Compare Old vs New Tax Regime',
    description:
      'Calculate your income tax under both Old and New Tax Regime for AY 2026-27. Compare tax savings and find optimal regime.',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <ErrorBoundary>
          <TaxProvider>{children}</TaxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
