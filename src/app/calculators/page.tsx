'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { HraCalculator } from '@/components/forms/HraCalculator';
import { SalaryCalculator } from '@/components/forms/SalaryCalculator';
import { TaxCalculator } from '@/components/calculator/TaxCalculator';
import { 
  CalculatorIcon,
  HomeIcon,
  BanknotesIcon,
  InformationCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

type CalculatorType = 'tax' | 'hra' | 'salary';

const calculators = [
  {
    id: 'tax',
    title: 'Tax Calculator',
    description: 'Compare Old vs New Tax Regime',
    icon: CalculatorIcon,
    color: 'blue',
    longDescription: 'Make informed decisions about your tax strategy with comprehensive comparisons, visual charts, and personalized recommendations.'
  },
  {
    id: 'hra',
    title: 'HRA Calculator',
    description: 'Calculate HRA exemptions & optimize rent',
    icon: HomeIcon,
    color: 'green',
    longDescription: 'Maximize your tax savings through HRA optimization with two calculation scenarios and city-based limits.'
  },
  {
    id: 'salary',
    title: 'Salary Calculator',
    description: 'Calculate in-hand salary & deductions',
    icon: BanknotesIcon,
    color: 'purple',
    longDescription: 'Get complete visibility into your salary structure with pre-tax and post-tax calculations.'
  }
];

export default function CalculatorsPage() {
  const searchParams = useSearchParams();
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('tax');

  useEffect(() => {
    const calculatorParam = searchParams.get('calculator') as CalculatorType;
    if (calculatorParam && ['tax', 'hra', 'salary'].includes(calculatorParam)) {
      setActiveCalculator(calculatorParam);
    }
  }, [searchParams]);

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
    const baseClasses = 'p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer';
    
    if (!isActive) {
      return `${baseClasses} border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-lg hover:scale-105`;
    }

    switch (color) {
      case 'blue':
        return `${baseClasses} border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105`;
      case 'green':
        return `${baseClasses} border-green-500 bg-green-50 text-green-700 shadow-lg scale-105`;
      case 'purple':
        return `${baseClasses} border-purple-500 bg-purple-50 text-purple-700 shadow-lg scale-105`;
      default:
        return `${baseClasses} border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105`;
    }
  };

  const getActiveCalculatorData = () => {
    return calculators.find(calc => calc.id === activeCalculator);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Header with Back Button */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/"
              className="p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
            </Link>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <CalculatorIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
              Financial Calculators
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed opacity-80">
            Comprehensive tools to help you plan your finances, optimize taxes, and understand your salary structure
          </p>
        </div>

        {/* Calculator Selection */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Choose Your Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calculators.map((calculator) => {
              const IconComponent = calculator.icon;
              const isActive = activeCalculator === calculator.id;
              
              return (
                <div
                  key={calculator.id}
                  onClick={() => setActiveCalculator(calculator.id as CalculatorType)}
                  className={getColorClasses(calculator.color, isActive)}
                >
                  <div className="text-center space-y-4">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${
                      calculator.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                      calculator.color === 'green' ? 'from-green-500 to-emerald-600' :
                      'from-purple-500 to-violet-600'
                    } p-4 shadow-lg`}>
                      <IconComponent className="h-12 w-12 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold text-lg">{calculator.title}</div>
                      <div className="text-sm opacity-80">{calculator.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Calculator Header */}
        {getActiveCalculatorData() && (
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl ${
              activeCalculator === 'tax' ? 'bg-blue-50 border border-blue-200' :
              activeCalculator === 'hra' ? 'bg-green-50 border border-green-200' :
              'bg-purple-50 border border-purple-200'
            }`}>
              {(() => {
                const IconComponent = getActiveCalculatorData()!.icon;
                return <IconComponent className={`h-6 w-6 ${
                  activeCalculator === 'tax' ? 'text-blue-600' :
                  activeCalculator === 'hra' ? 'text-green-600' :
                  'text-purple-600'
                }`} />;
              })()}
              <span className={`font-semibold ${
                activeCalculator === 'tax' ? 'text-blue-800' :
                activeCalculator === 'hra' ? 'text-green-800' :
                'text-purple-800'
              }`}>
                {getActiveCalculatorData()!.title}
              </span>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getActiveCalculatorData()!.longDescription}
            </p>
          </div>
        )}

        {/* Active Calculator */}
        <div className="space-y-8">
          {getActiveCalculator()}
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-200/40 rounded-2xl p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <InformationCircleIcon className="h-8 w-8 text-blue-500" />
              <h3 className="text-2xl font-semibold text-gray-800">💡 Pro Tips</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="space-y-3">
                <div className="font-medium text-gray-800">Tax Calculator</div>
                <ul className="space-y-2 text-xs">
                  <li>• Compare both tax regimes to find the best option</li>
                  <li>• Maximize deductions under Old Tax Regime</li>
                  <li>• Consider New Tax Regime for simplicity</li>
                  <li>• Use visual charts for better understanding</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="font-medium text-gray-800">HRA Calculator</div>
                <ul className="space-y-2 text-xs">
                  <li>• Optimize rent to fully utilize HRA</li>
                  <li>• Metro cities allow 50% of basic salary</li>
                  <li>• Keep rent receipts for tax filing</li>
                  <li>• Consider city type for accurate limits</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="font-medium text-gray-800">Salary Calculator</div>
                <ul className="space-y-2 text-xs">
                  <li>• Understand your complete salary structure</li>
                  <li>• Plan deductions and allowances</li>
                  <li>• Calculate actual take-home pay</li>
                  <li>• Compare tax regime impacts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
