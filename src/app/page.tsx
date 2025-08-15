import { TaxCalculator } from '@/components/calculator/TaxCalculator';
import { TaxProvider } from '@/lib/TaxContext';

export default function Home() {
  return (
    <TaxProvider>
      <main className="min-h-screen bg-gray-50">
        <TaxCalculator />
      </main>
    </TaxProvider>
  );
}
