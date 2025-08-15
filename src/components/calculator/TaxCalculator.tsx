'use client';
import React, { useState } from 'react';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { DeductionsForm } from '@/components/forms/DeductionsForm';
import { TaxResults } from '@/components/calculator/TaxResults';
import { Card } from '@/components/ui/Card';
import { useTax } from '@/lib/TaxContext';
import { formatCurrency } from '@/utils/formatters';
import {
  CalculatorIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

type Step = 'income' | 'deductions' | 'results';

export function TaxCalculator() {
  const { state, calculateTax, resetCalculator } = useTax();
  const { income, comparison, isLoading, error } = state;
  const [currentStep, setCurrentStep] = useState<Step>('income');
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());

  const hasIncome = Object.values(income).some(value => value > 0);

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll to top when step changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep === 'income') {
      setCurrentStep('deductions');
      setCompletedSteps(prev => new Set([...prev, 'income']));
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 'deductions') {
      calculateTax();
      setCurrentStep('results');
      setCompletedSteps(prev => new Set([...prev, 'deductions']));
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'deductions') {
      setCurrentStep('income');
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 'results') {
      setCurrentStep('deductions');
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    resetCalculator();
    setCurrentStep('income');
    setCompletedSteps(new Set());
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canProceedToNext = () => {
    if (currentStep === 'income') {
      return hasIncome;
    }
    return true;
  };

  const steps = [
    { id: 'income', title: 'Income Details', description: 'Enter your annual income from all sources' },
    { id: 'deductions', title: 'Deductions', description: 'Enter your investments and exemptions' },
    { id: 'results', title: 'Tax Results', description: 'Compare Old vs New Tax Regime' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <CalculatorIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Indian Tax Calculator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed opacity-80">
            Compare Old vs New Tax Regime for AY 2026-27 and find out which one saves you more money
          </p>
        </div>

        {/* Stepper Navigation */}
        <div className="flex justify-center px-4">
          <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-16">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col lg:flex-row items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center text-base font-semibold transition-all duration-200
                    ${currentStep === step.id 
                      ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100' 
                      : completedSteps.has(step.id as Step)
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                    }
                  `}>
                    {completedSteps.has(step.id as Step) ? (
                      <CheckIcon className="h-7 w-7" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="mt-4 text-center max-w-40">
                    <div className={`text-base font-semibold ${
                      currentStep === step.id ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <>
                    {/* Mobile: Vertical line */}
                    <div className="lg:hidden w-0.5 h-12 bg-gray-200 my-4" />
                    {/* Desktop: Horizontal line */}
                    <div className={`hidden lg:block w-20 h-0.5 mx-6 ${
                      completedSteps.has(step.id as Step) ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto px-4">
          {/* Step Content */}
          {currentStep === 'income' && (
            <div className="space-y-8">
              <IncomeForm />
              
              {/* Navigation */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleNextStep}
                  disabled={!canProceedToNext()}
                  className={`
                    px-10 py-4 rounded-xl font-semibold text-white text-lg
                    flex items-center space-x-3 transition-all duration-200 ease-out
                    ${canProceedToNext()
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <span>Continue to Deductions</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'deductions' && (
            <div className="space-y-8">
              <DeductionsForm />
              
              {/* Navigation */}
              <div className="flex justify-between items-center pt-8">
                <button
                  onClick={handlePreviousStep}
                  className="px-8 py-4 rounded-xl font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
                >
                  <ArrowRightIcon className="h-4 w-4 rotate-180" />
                  <span>Back to Income</span>
                </button>
                
                <button
                  onClick={handleNextStep}
                  className="px-10 py-4 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-3 transition-all duration-200 ease-out"
                >
                  <CalculatorIcon className="h-5 w-5" />
                  <span>Calculate Tax</span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'results' && comparison && (
            <div className="space-y-8">
              <TaxResults comparison={comparison} onReset={handleReset} />
            </div>
          )}

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
        </div>

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
      </div>
    </div>
  );
}
