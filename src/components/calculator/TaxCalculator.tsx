'use client';

import React from 'react';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { DeductionsForm } from '@/components/forms/DeductionsForm';
import { Card } from '@/components/ui/Card';
import { useTax } from '@/lib/TaxContext';
import { formatCurrency } from '@/utils/formatters';
import { 
  CalculatorIcon, 
  ArrowPathIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

export function TaxCalculator() {
  const { state, calculateTax, resetCalculator } = useTax();
  const { income, deductions, comparison, isLoading, error } = state;

  const hasIncome = Object.values(income).some(value => value > 0);
  const hasDeductions = Object.values(deductions).some(value => value > 0);

  const handleCalculate = () => {
    if (hasIncome) {
      calculateTax();
    }
  };

  const handleReset = () => {
    resetCalculator();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <CalculatorIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Indian Tax Calculator</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Compare Old vs New Tax Regime for AY 2026-27 and find out which one saves you more money
        </p>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <IncomeForm />
        <DeductionsForm />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={handleCalculate}
          disabled={!hasIncome || isLoading}
          className={`
            px-8 py-3 rounded-lg font-semibold text-white text-lg
            flex items-center space-x-2 transition-all duration-200
            ${hasIncome && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          <CalculatorIcon className="h-5 w-5" />
          <span>
            {isLoading ? 'Calculating...' : 'Calculate Tax'}
          </span>
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <InformationCircleIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-800 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <Card 
        title="💡 Quick Tips" 
        subtitle="Make the most of your tax planning"
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <p><strong>•</strong> Old Tax Regime allows full deductions but higher tax rates</p>
            <p><strong>•</strong> New Tax Regime has lower rates but limited deductions</p>
            <p><strong>•</strong> Use 80C investments to save up to ₹1.5L in taxes</p>
          </div>
          <div className="space-y-2">
            <p><strong>•</strong> HRA exemption can save significant tax if you&apos;re renting</p>
            <p><strong>•</strong> Health insurance premiums are deductible under 80D</p>
            <p><strong>•</strong> NPS offers additional ₹50K deduction beyond 80C</p>
          </div>
        </div>
      </Card>

      {/* Results will be displayed here when calculation is complete */}
      {comparison && (
        <div className="mt-8">
          {/* Results component will be added here */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Calculation Complete! 🎉
            </h3>
            <p className="text-green-700">
              Your tax comparison is ready. Results component will be implemented next.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
