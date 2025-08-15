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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <CalculatorIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Indian Tax Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Compare Old vs New Tax Regime for AY 2026-27 and find out which one saves you more money
          </p>
        </div>

        {/* Forms Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <IncomeForm />
          <DeductionsForm />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleCalculate}
            disabled={!hasIncome || isLoading}
            className={`
              px-8 py-4 rounded-xl font-semibold text-white text-base
              flex items-center space-x-3 transition-all duration-200
              ${hasIncome && !isLoading
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
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
            className="px-6 py-4 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <InformationCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <span className="text-red-800 font-semibold">Error: </span>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <Card 
          title="💡 Quick Tips" 
          subtitle="Make the most of your tax planning"
          className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
            <div className="space-y-3">
              <p className="flex items-start space-x-2">
                <span className="text-blue-600 font-semibold">•</span>
                <span>Old Tax Regime allows full deductions but higher tax rates</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-blue-600 font-semibold">•</span>
                <span>New Tax Regime has lower rates but limited deductions</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-blue-600 font-semibold">•</span>
                <span>Use 80C investments to save up to ₹1.5L in taxes</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-start space-x-2">
                <span className="text-blue-600 font-semibold">•</span>
                <span>HRA exemption can save significant tax if you&apos;re renting</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-blue-600 font-semibold">•</span>
                <span>Health insurance premiums are deductible under 80D</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-blue-600 font-semibold">•</span>
                <span>NPS offers additional ₹50K deduction beyond 80C</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Results will be displayed here when calculation is complete */}
        {comparison && (
          <div className="mt-8">
            {/* Results component will be added here */}
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Calculation Complete! 🎉
              </h3>
              <p className="text-green-700 text-lg">
                Your tax comparison is ready. Results component will be implemented next.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
