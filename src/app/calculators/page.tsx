'use client';

import React, { useState } from 'react';
import { HraCalculator } from '@/components/forms/HraCalculator';
import { SalaryCalculator } from '@/components/forms/SalaryCalculator';
import { TaxCalculator } from '@/components/calculator/TaxCalculator';
import { 
  CalculatorIcon,
  HomeIcon,
  BanknotesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

type CalculatorType = 'tax' | 'hra' | 'salary';

const calculators = [
  {
    id: 'tax',
    title: 'Tax Calculator',
    description: 'Compare Old vs New Tax Regime',
    icon: CalculatorIcon,
    color: 'blue'
  },
  {
    id: 'hra',
    title: 'HRA Calculator',
    description: 'Calculate HRA exemptions & optimize rent',
    icon: HomeIcon,
    color: 'green'
  },
  {
    id: 'salary',
    title: 'Salary Calculator',
    description: 'Calculate in-hand salary & deductions',
    icon: BanknotesIcon,
    color: 'purple'
  }
];

export default function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('tax');

  const getActiveCalculator = () => {
    switch (activeCalculator) {
      case 'hra':
        return <HraCalculator />;
      case 'salary':
        return <SalaryCalculator />;
      default:
        return <TaxCalculator />;
    }
  };

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = 'p-4 rounded-xl border-2 transition-all duration-200';
    
    if (!isActive) {
      return `${baseClasses} border-gray-200 bg-white text-gray-600 hover:border-gray-300`;
    }

    switch (color) {
      case 'blue':
        return `${baseClasses} border-blue-500 bg-blue-50 text-blue-700`;
      case 'green':
        return `${baseClasses} border-green-500 bg-green-50 text-green-700`;
      case 'purple':
        return `${baseClasses} border-purple-500 bg-purple-50 text-purple-700`;
      default:
        return `${baseClasses} border-blue-500 bg-blue-50 text-blue-700`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <CalculatorIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800">
              Financial Calculators
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed opacity-80">
            Comprehensive tools to help you plan your finances, optimize taxes, and understand your salary structure
          </p>
        </div>

        {/* Calculator Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Choose Your Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calculators.map((calculator) => {
              const IconComponent = calculator.icon;
              const isActive = activeCalculator === calculator.id;
              
              return (
                <button
                  key={calculator.id}
                  onClick={() => setActiveCalculator(calculator.id as CalculatorType)}
                  className={getColorClasses(calculator.color, isActive)}
                >
                  <div className="text-center space-y-3">
                    <IconComponent className="h-12 w-12 mx-auto" />
                    <div className="font-semibold text-lg">{calculator.title}</div>
                    <div className="text-sm opacity-80">{calculator.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Calculator */}
        <div className="space-y-8">
          {getActiveCalculator()}
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-200/40 rounded-xl p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <InformationCircleIcon className="h-8 w-8 text-blue-500" />
              <h3 className="text-2xl font-semibold text-gray-800">💡 Pro Tips</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="space-y-2">
                <div className="font-medium text-gray-800">Tax Calculator</div>
                <ul className="space-y-1 text-xs">
                  <li>• Compare both tax regimes to find the best option</li>
                  <li>• Maximize deductions under Old Tax Regime</li>
                  <li>• Consider New Tax Regime for simplicity</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-gray-800">HRA Calculator</div>
                <ul className="space-y-1 text-xs">
                  <li>• Optimize rent to fully utilize HRA</li>
                  <li>• Metro cities allow 50% of basic salary</li>
                  <li>• Keep rent receipts for tax filing</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-gray-800">Salary Calculator</div>
                <ul className="space-y-1 text-xs">
                  <li>• Understand your complete salary structure</li>
                  <li>• Plan deductions and allowances</li>
                  <li>• Calculate actual take-home pay</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
