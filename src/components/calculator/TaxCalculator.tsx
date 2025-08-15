'use client';

import React from 'react';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { DeductionsForm } from '@/components/forms/DeductionsForm';
import { TaxResults } from '@/components/calculator/TaxResults';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Header */}
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <CalculatorIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Indian Tax Calculator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed opacity-80">
            Compare Old vs New Tax Regime for AY 2026-27 and find out which one saves you more money
          </p>
        </div>

        {/* Forms Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          <IncomeForm />
          <DeductionsForm />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={handleCalculate}
            disabled={!hasIncome || isLoading}
            className={`
              px-8 py-4 rounded-lg font-medium text-white text-base
              flex items-center space-x-3 transition-all duration-200 ease-out
              ${hasIncome && !isLoading
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
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
            className="px-6 py-4 rounded-lg font-medium text-gray-600 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 flex items-center space-x-3 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg font-semibold text-blue-800">Calculating Tax...</span>
            </div>
            <p className="text-blue-700">
              Please wait while we process your income and deductions
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-8 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <InformationCircleIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <span className="text-red-800 font-semibold text-lg">Error: </span>
                <span className="text-red-700 text-lg">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <Card 
          title="💡 Quick Tips" 
          subtitle="Make the most of your tax planning"
          className="max-w-5xl mx-auto bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border-blue-200/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
            <div className="space-y-3">
              <p className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Old Tax Regime allows full deductions but higher tax rates</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>New Tax Regime has lower rates but limited deductions</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Use 80C investments to save up to ₹1.5L in taxes</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>HRA exemption can save significant tax if you&apos;re renting</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>Health insurance premiums are deductible under 80D</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>NPS offers additional ₹50K deduction beyond 80C</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Results will be displayed here when calculation is complete */}
        {comparison && (
          <TaxResults comparison={comparison} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
