import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indian Tax Calculator - Compare Old vs New Tax Regime | Pay Right",
  description: "Calculate your income tax under both Old and New Tax Regime for AY 2026-27. Compare tax savings, find optimal regime, and plan your deductions with our comprehensive Indian tax calculator.",
  keywords: "Indian tax calculator, old tax regime, new tax regime, income tax calculation, 80C deductions, HRA exemption, tax planning, AY 2026-27, FY 2025-26",
  authors: [{ name: "payRight Team" }],
  openGraph: {
    title: "Indian Tax Calculator - Compare Old vs New Tax Regime",
    description: "Calculate your income tax under both Old and New Tax Regime for AY 2026-27. Compare tax savings and find optimal regime.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indian Tax Calculator - Compare Old vs New Tax Regime",
    description: "Calculate your income tax under both Old and New Tax Regime for AY 2026-27. Compare tax savings and find optimal regime.",
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
