'use client';
import React, { useState, useEffect } from 'react';
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
  ArrowRightIcon,
  LightBulbIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

type Step = 'income' | 'deductions' | 'results';

export function TaxCalculator() {
  const { state, calculateTax, resetCalculator } = useTax();
  const { income, deductions, comparison, isLoading, error } = state;
  const [currentStep, setCurrentStep] = useState<Step>('income');
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());
  const [showTips, setShowTips] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<Array<{timestamp: Date, step: Step, data: any}>>([]);

  const hasIncome = Object.values(income).some(value => value > 0);

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Scroll to top when step changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Track step changes in history
  useEffect(() => {
    if (currentStep !== 'income') {
      setCalculationHistory(prev => [{
        timestamp: new Date(),
        step: currentStep,
        data: currentStep === 'deductions' ? { income, deductions: {} } : { income, deductions }
      }, ...prev.slice(0, 4)]);
    }
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
      // Check if basic salary is filled (required field)
      return income.basicSalary > 0;
    }
    if (currentStep === 'deductions') {
      // For deductions, allow proceeding even with 0 deductions
      // as deductions are optional for tax calculation
      return true;
    }
    return false;
  };

  const getStepCompletionStatus = (step: Step) => {
    if (step === 'income') {
      const requiredFields = ['basicSalary'];
      const optionalFields = ['hra', 'rsus', 'performanceBonus', 'specialAllowance', 'otherAllowances'];
      const requiredComplete = requiredFields.every(field => income[field as keyof typeof income] > 0);
      const optionalComplete = optionalFields.filter(field => income[field as keyof typeof income] > 0).length;
      return requiredComplete ? (optionalComplete / optionalFields.length) * 50 + 50 : (income.basicSalary > 0 ? 25 : 0);
    }
    if (step === 'deductions') {
      const totalFields = Object.keys(deductions).length;
      const filledFields = Object.values(deductions).filter(value => value > 0).length;
      return Math.round((filledFields / totalFields) * 100);
    }
    return 0;
  };

  const getTotalIncome = () => {
    return Object.values(income).reduce((sum, value) => sum + (value || 0), 0);
  };

  const getTotalDeductions = () => {
    return Object.values(deductions).reduce((sum, value) => sum + (value || 0), 0);
  };

  const steps = [
    { 
      id: 'income', 
      title: 'Income Details', 
      description: 'Enter your annual income from all sources',
      icon: UserGroupIcon,
      color: 'blue'
    },
    { 
      id: 'deductions', 
      title: 'Deductions & Exemptions', 
      description: 'Enter your investments and tax-saving options',
      icon: ChartBarIcon,
      color: 'green'
    },
    { 
      id: 'results', 
      title: 'Tax Analysis', 
      description: 'Compare Old vs New Tax Regime results',
      icon: CalculatorIcon,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* Enhanced Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
              <CalculatorIcon className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Indian Tax Calculator
              </h1>
              <p className="text-lg text-gray-600 font-medium">AY 2026-27 • Compare Old vs New Tax Regime</p>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed opacity-80">
            Make informed decisions about your tax strategy. Compare both regimes side-by-side with detailed breakdowns, 
            visual charts, and personalized recommendations to maximize your savings.
          </p>
          
          {/* Quick Stats */}
          {hasIncome && (
            <div className="flex flex-wrap justify-center items-center gap-6 pt-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-blue-200 shadow-lg">
                <div className="text-sm text-gray-600">Total Income</div>
                <div className="text-xl font-bold text-blue-600">
                  ₹{getTotalIncome().toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-green-200 shadow-lg">
                <div className="text-sm text-gray-600">Total Deductions</div>
                <div className="text-xl font-bold text-green-600">
                  ₹{getTotalDeductions().toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-purple-200 shadow-lg">
                <div className="text-sm text-gray-600">Taxable Income</div>
                <div className="text-xl font-bold text-purple-600">
                  ₹{Math.max(0, getTotalIncome() - getTotalDeductions()).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Stepper Navigation */}
        <div className="flex justify-center px-4">
          <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-16">
            {steps.map((step, index) => {
              const completion = getStepCompletionStatus(step.id as Step);
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.has(step.id as Step);
              const IconComponent = step.icon;
              
              return (
                <div key={step.id} className="flex flex-col lg:flex-row items-center">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center text-base font-semibold transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl ring-4 ring-blue-100 scale-110' 
                          : isCompleted
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl scale-105'
                          : 'bg-white text-gray-500 border-2 border-gray-200 hover:border-gray-300 hover:scale-105'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckIcon className="h-8 w-8" />
                        ) : (
                          <IconComponent className="h-8 w-8" />
                        )}
                      </div>
                      
                      {/* Completion indicator */}
                      {!isCompleted && completion > 0 && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xs font-bold text-white">{completion}%</span>
                        </div>
                      )}
                      
                      {/* Hover effect */}
                      {!isActive && !isCompleted && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      )}
                    </div>
                    
                    <div className="mt-4 text-center max-w-48">
                      <div className={`text-lg font-semibold ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-700'}`}>
                        {step.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-2 leading-relaxed">
                        {step.description}
                      </div>
                      {completion > 0 && !isCompleted && (
                        <div className="mt-2 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                          {completion}% Complete
                        </div>
                      )}
                      {isCompleted && (
                        <div className="mt-2 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                          ✓ Completed
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <>
                      <div className="lg:hidden w-0.5 h-12 bg-gradient-to-b from-gray-200 to-transparent my-4" />
                      <div className={`hidden lg:block w-24 h-1 mx-6 rounded-full ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                          : 'bg-gradient-to-r from-gray-200 to-gray-300'
                      }`} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Tips Toggle */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 max-w-4xl mx-auto">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-3">
              <LightBulbIcon className="h-6 w-6 text-amber-600" />
              <span className="font-semibold text-amber-800">💡 Smart Tax Planning Tips</span>
            </div>
            <span className="text-amber-600 text-sm">{showTips ? 'Hide' : 'Show'}</span>
          </button>
          
          {showTips && (
            <div className="mt-4 space-y-4 text-sm text-amber-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-medium mb-2">🎯 Tax Regime Selection:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>Old Regime:</strong> Best if you have significant deductions (&gt;₹2L)</li>
                    <li>• <strong>New Regime:</strong> Best for simplicity and lower rates</li>
                    <li>• <strong>Compare both</strong> to find your optimal choice</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-2">💰 Maximizing Deductions:</div>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>80C:</strong> Invest up to ₹1.5L in ELSS, PPF, etc.</li>
                    <li>• <strong>HRA:</strong> Optimize rent to maximize exemptions</li>
                    <li>• <strong>80D:</strong> Health insurance premiums are deductible</li>
                    <li>• <strong>NPS:</strong> Additional ₹50K deduction beyond 80C</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto px-4">
          {/* Step Content */}
          {currentStep === 'income' && (
            <div className="space-y-8">
              <IncomeForm />
            </div>
          )}

          {currentStep === 'deductions' && (
            <div className="space-y-8">
              <DeductionsForm />
            </div>
          )}

          {currentStep === 'results' && comparison && (
            <div className="space-y-8">
              <TaxResults comparison={comparison} onReset={handleReset} />
            </div>
          )}

          {/* Enhanced Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            {currentStep === 'income' && (
              <button
                onClick={handleNextStep}
                disabled={!canProceedToNext()}
                className={`
                  group px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center space-x-3 shadow-2xl
                  ${canProceedToNext() 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transform hover:shadow-blue-500/25' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <span>Continue to Deductions</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            )}
            
            {currentStep === 'deductions' && (
              <>
                <button
                  onClick={handlePreviousStep}
                  className="px-8 py-4 rounded-2xl font-medium text-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3 border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  <ArrowRightIcon className="h-5 w-5 rotate-180" />
                  <span>Back to Income</span>
                </button>
                
                <button
                  onClick={handleNextStep}
                  className="group px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-3 shadow-2xl hover:scale-105 transform hover:shadow-green-500/25"
                >
                  <span>Calculate Tax</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </>
            )}
            
            {currentStep === 'results' && (
              <button
                onClick={handleReset}
                className="px-8 py-4 rounded-2xl font-medium text-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3 border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Calculate Again</span>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 text-center shadow-2xl">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <span className="text-xl font-semibold text-blue-800">Calculating Your Tax...</span>
            </div>
            <p className="text-blue-700 mb-4">
              Please wait while we process your income and deductions
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}

        {/* Enhanced Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <InformationCircleIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <span className="text-red-800 font-semibold text-lg">Calculation Error: </span>
                <span className="text-red-700 text-lg">{error}</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-red-600">
              Please check your inputs and try again. If the problem persists, contact support.
            </div>
          </div>
        )}

        {/* Calculation History */}
        {calculationHistory.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-4xl mx-auto">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-gray-600" />
              <span>Recent Activity</span>
            </h4>
            <div className="space-y-3">
              {calculationHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {item.step === 'income' ? 'Income' : item.step === 'deductions' ? 'Deductions' : 'Results'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {item.step === 'income' && `Income: ₹${Object.values(item.data.income || {}).reduce((sum: number, val: any) => sum + (val || 0), 0).toLocaleString('en-IN')}`}
                    {item.step === 'deductions' && `Deductions: ₹${Object.values(item.data.deductions || {}).reduce((sum: number, val: any) => sum + (val || 0), 0).toLocaleString('en-IN')}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Quick Tips */}
        <Card 
          title="💡 Pro Tax Planning Tips" 
          subtitle="Make the most of your tax planning with these expert insights"
          className="max-w-5xl mx-auto bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border-blue-200/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-800">Old Tax Regime Strategy</div>
                  <div className="text-xs text-gray-500 mt-1">Best for high deductions, allows full exemptions including HRA, 80C, 80D, and more</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-800">New Tax Regime Strategy</div>
                  <div className="text-xs text-gray-500 mt-1">Lower tax rates, simplified filing, but limited deductions (only standard deduction)</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-800">Smart Investment Planning</div>
                  <div className="text-xs text-gray-500 mt-1">Use 80C investments, HRA optimization, and health insurance for maximum savings</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-800">HRA Optimization</div>
                  <div className="text-xs text-gray-500 mt-1">Rent planning can save significant tax under Old Tax Regime</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-800">Health & Insurance</div>
                  <div className="text-xs text-gray-500 mt-1">80D deductions for health insurance and preventive health checkups</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="font-medium text-gray-800">NPS Benefits</div>
                  <div className="text-xs text-gray-500 mt-1">Additional ₹50K deduction beyond 80C limit for retirement planning</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
