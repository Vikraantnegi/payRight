'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { 
  HomeIcon, 
  CalculatorIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  LightBulbIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface HraCalculation {
  basicSalary: number;
  hraComponent: number;
  monthlyRent: number;
  cityType: 'metro' | 'non-metro';
  actualRentPaid: number;
  hraExemption: number;
  taxableHra: number;
  requiredRent: number;
}

export function HraCalculator() {
  const [scenario, setScenario] = useState<'A' | 'B'>('A');
  const [calculation, setCalculation] = useState<HraCalculation>({
    basicSalary: 0,
    hraComponent: 0,
    monthlyRent: 0,
    cityType: 'metro',
    actualRentPaid: 0,
    hraExemption: 0,
    taxableHra: 0,
    requiredRent: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTips, setShowTips] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<Array<{timestamp: Date, data: HraCalculation}>>([]);

  const handleInputChange = (field: keyof HraCalculation, value: number | string) => {
    const newCalculation = { ...calculation, [field]: value };
    setCalculation(newCalculation);
    validateInputs(newCalculation);
  };

  const validateInputs = (data: HraCalculation) => {
    const newErrors: Record<string, string> = {};

    if (data.basicSalary <= 0) {
      newErrors.basicSalary = 'Basic salary must be greater than 0';
    } else if (data.basicSalary > 10000000) {
      newErrors.basicSalary = 'Basic salary seems unusually high. Please verify the amount.';
    }

    if (data.hraComponent <= 0) {
      newErrors.hraComponent = 'HRA component must be greater than 0';
    } else if (data.hraComponent > data.basicSalary * 0.5) {
      newErrors.hraComponent = `HRA cannot exceed 50% of basic salary (₹${(data.basicSalary * 0.5).toLocaleString('en-IN')})`;
    }

    if (scenario === 'A') {
      if (data.monthlyRent < 0) {
        newErrors.monthlyRent = 'Monthly rent cannot be negative';
      }
    } else {
      if (data.actualRentPaid < 0) {
        newErrors.actualRentPaid = 'Actual rent paid cannot be negative';
      } else if (data.actualRentPaid > 1000000) {
        newErrors.actualRentPaid = 'Monthly rent seems unusually high. Please verify the amount.';
      }
    }

    setErrors(newErrors);
  };

  const calculateHra = () => {
    if (Object.keys(errors).length > 0) return;

    const { basicSalary, hraComponent, cityType, monthlyRent, actualRentPaid } = calculation;
    
    // HRA Exemption calculation
    const hraExemption = Math.min(
      hraComponent, // Actual HRA received
      actualRentPaid - (basicSalary * 0.1), // Rent paid - 10% of basic salary
      cityType === 'metro' ? basicSalary * 0.5 : basicSalary * 0.4 // 50% for metro, 40% for non-metro
    );

    const taxableHra = Math.max(0, hraComponent - hraExemption);
    
    // For Scenario A: Calculate required rent to fully utilize HRA
    const requiredRent = hraComponent + (basicSalary * 0.1);

    const newCalculation = {
      ...calculation,
      hraExemption: Math.max(0, hraExemption),
      taxableHra,
      requiredRent: Math.round(requiredRent)
    };

    setCalculation(newCalculation);
    
    // Add to calculation history
    setCalculationHistory(prev => [{
      timestamp: new Date(),
      data: newCalculation
    }, ...prev.slice(0, 4)]); // Keep last 5 calculations
  };

  useEffect(() => {
    if (calculation.basicSalary > 0 && calculation.hraComponent > 0) {
      calculateHra();
    }
  }, [calculation.basicSalary, calculation.hraComponent, calculation.cityType, calculation.monthlyRent, calculation.actualRentPaid]);

  const getCityMultiplier = () => calculation.cityType === 'metro' ? 0.5 : 0.4;
  const getCityName = () => calculation.cityType === 'metro' ? 'Metro Cities' : 'Non-Metro Cities';

  const getChartData = () => {
    if (calculation.basicSalary === 0) return [];
    
    return [
      { name: 'HRA Exemption', value: calculation.hraExemption, color: '#10b981' },
      { name: 'Taxable HRA', value: calculation.taxableHra, color: '#f59e0b' }
    ].filter(item => item.value > 0);
  };

  const getBreakdownData = () => {
    if (calculation.basicSalary === 0) return [];
    
    return [
      { name: 'Basic Salary', value: calculation.basicSalary, color: '#3b82f6' },
      { name: 'HRA Component', value: calculation.hraComponent, color: '#10b981' },
      { name: 'City Limit', value: calculation.basicSalary * getCityMultiplier(), color: '#8b5cf6' },
      { name: 'Rent - 10% Basic', value: Math.max(0, (calculation.actualRentPaid || 0) - (calculation.basicSalary * 0.1)), color: '#f59e0b' }
    ];
  };

  const getTaxSavings = () => {
    const taxRate = 0.3; // Assuming 30% tax rate for calculation
    return calculation.hraExemption * taxRate;
  };

  return (
    <Card title="🏠 HRA Calculator" subtitle="Optimize your HRA exemptions and maximize tax savings" className="space-y-8">
      {/* Enhanced Scenario Selection */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Choose Your Calculation Scenario</h3>
          <p className="text-gray-600">Select the scenario that best fits your current situation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setScenario('A')}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
              scenario === 'A'
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md hover:scale-102'
            }`}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
                <CalculatorIcon className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg">Scenario A: Rent Planning</div>
                <div className="text-sm opacity-80">I want to know how much rent I need to pay to fully utilize my HRA</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setScenario('B')}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
              scenario === 'B'
                ? 'border-green-500 bg-green-50 text-green-700 shadow-lg scale-105'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md hover:scale-102'
            }`}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-4">
                <HomeIcon className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg">Scenario B: Exemption Calculation</div>
                <div className="text-sm opacity-80">I want to calculate my HRA exemption based on actual rent paid</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Smart Tips Toggle */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center space-x-3">
            <LightBulbIcon className="h-6 w-6 text-amber-600" />
            <span className="font-semibold text-amber-800">💡 Smart HRA Tips</span>
          </div>
          <span className="text-amber-600 text-sm">{showTips ? 'Hide' : 'Show'}</span>
        </button>
        
        {showTips && (
          <div className="mt-4 space-y-3 text-sm text-amber-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-2">🎯 For Rent Planning (Scenario A):</div>
                <ul className="space-y-1 text-xs">
                  <li>• Calculate optimal rent to maximize HRA benefits</li>
                  <li>• Consider your current rent vs. required rent</li>
                  <li>• Factor in 10% of basic salary deduction</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2">📊 For Exemption Calculation (Scenario B):</div>
                <ul className="space-y-1 text-xs">
                  <li>• Get actual HRA exemption amount</li>
                  <li>• Understand taxable vs. tax-free HRA</li>
                  <li>• Plan your tax savings strategy</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input Fields */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Input
            label="Basic Salary *"
            type="currency"
            value={calculation.basicSalary || 0}
            onChange={(value) => handleInputChange('basicSalary', value)}
            placeholder="Enter your annual basic salary"
            helperText="Your base salary before any allowances (this affects HRA limits)"
            error={errors.basicSalary}
            className={errors.basicSalary ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="HRA Component *"
            type="currency"
            value={calculation.hraComponent || 0}
            onChange={(value) => handleInputChange('hraComponent', value)}
            placeholder="Enter annual HRA amount"
            helperText="HRA provided by your company (usually 40-50% of basic salary)"
            error={errors.hraComponent}
            className={errors.hraComponent ? 'ring-2 ring-red-200' : ''}
          />
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              City Type *
            </label>
            <select
              value={calculation.cityType}
              onChange={(e) => handleInputChange('cityType', e.target.value as 'metro' | 'non-metro')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            >
              <option value="metro">🏙️ Metro Cities (Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad)</option>
              <option value="non-metro">🏘️ Non-Metro Cities (All other cities)</option>
            </select>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <InformationCircleIcon className="h-4 w-4" />
              <span>
                {calculation.cityType === 'metro' 
                  ? 'Metro cities allow 50% of basic salary as HRA exemption'
                  : 'Non-metro cities allow 40% of basic salary as HRA exemption'
                }
              </span>
            </div>
          </div>

          {scenario === 'A' ? (
            <Input
              label="Current Monthly Rent (Optional)"
              type="currency"
              value={calculation.monthlyRent || 0}
              onChange={(value) => handleInputChange('monthlyRent', value)}
              placeholder="Enter your current rent if any"
              helperText="Optional: See how much HRA exemption you'll get with current rent"
              error={errors.monthlyRent}
              className={errors.monthlyRent ? 'ring-2 ring-red-200' : ''}
            />
          ) : (
            <Input
              label="Actual Monthly Rent Paid *"
              type="currency"
              value={calculation.actualRentPaid || 0}
              onChange={(value) => handleInputChange('actualRentPaid', value)}
              placeholder="Enter monthly rent you're paying"
              helperText="The actual rent you pay monthly (required for exemption calculation)"
              error={errors.actualRentPaid}
              className={errors.actualRentPaid ? 'ring-2 ring-red-200' : ''}
            />
          )}
        </div>
      </div>

      {/* Enhanced HRA Limits Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3 mb-4">
          <ChartBarIcon className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-blue-800 text-lg mb-2">HRA Exemption Calculation Factors</div>
            <div className="text-sm text-blue-700">
              HRA exemption is calculated as the <strong>minimum</strong> of these three amounts:
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                ₹{calculation.hraComponent?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-xs text-blue-700 font-medium">Actual HRA Received</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                ₹{Math.max(0, (calculation.actualRentPaid || 0) - (calculation.basicSalary || 0) * 0.1).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-blue-700 font-medium">Rent Paid - 10% of Basic</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                ₹{((calculation.basicSalary || 0) * getCityMultiplier()).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-blue-700 font-medium">{getCityName()} Limit ({getCityMultiplier() * 100}%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Results with Charts */}
      {calculation.basicSalary > 0 && calculation.hraComponent > 0 && (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Your HRA Analysis Results</h3>
            <p className="text-gray-600">Comprehensive breakdown of your HRA benefits and tax savings</p>
          </div>
          
          {/* Key Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HRA Exemption */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CheckCircleIcon className="h-7 w-7 text-green-500" />
                <span className="text-lg font-semibold text-green-800">Tax-Free HRA</span>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                ₹{calculation.hraExemption?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-green-600 mb-3">Annually tax-free</div>
              <div className="text-xs text-green-700 bg-green-100 rounded-lg px-3 py-1">
                Tax Savings: ₹{getTaxSavings().toLocaleString('en-IN')}
              </div>
            </div>

            {/* Taxable HRA */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <ExclamationTriangleIcon className="h-7 w-7 text-orange-500" />
                <span className="text-lg font-semibold text-orange-800">Taxable HRA</span>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                ₹{calculation.taxableHra?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-orange-600 mb-3">Subject to income tax</div>
              <div className="text-xs text-orange-700 bg-orange-100 rounded-lg px-3 py-1">
                Tax Impact: ₹{(calculation.taxableHra * 0.3).toLocaleString('en-IN')}
              </div>
            </div>

            {/* Scenario-specific results */}
            {scenario === 'A' ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <CalculatorIcon className="h-7 w-7 text-blue-500" />
                  <span className="text-lg font-semibold text-blue-800">Required Rent</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₹{calculation.requiredRent?.toLocaleString('en-IN') || '0'}
                </div>
                <div className="text-sm text-blue-600 mb-3">Monthly to fully utilize HRA</div>
                <div className="text-xs text-blue-700 bg-blue-100 rounded-lg px-3 py-1">
                  Formula: HRA + (10% × Basic)
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <HomeIcon className="h-7 w-7 text-purple-500" />
                  <span className="text-lg font-semibold text-purple-800">Utilization</span>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {calculation.hraComponent > 0 ? Math.round((calculation.hraExemption / calculation.hraComponent) * 100) : 0}%
                </div>
                <div className="text-sm text-purple-600 mb-3">Of HRA utilized</div>
                <div className="text-xs text-purple-700 bg-purple-100 rounded-lg px-3 py-1">
                  {calculation.hraExemption >= calculation.hraComponent ? 'Fully Optimized!' : 'Room for improvement'}
                </div>
              </div>
            )}
          </div>

          {/* Charts Section */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800 text-center">Visual Breakdown</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* HRA Composition Chart */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4 text-center">HRA Composition</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getChartData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* HRA Limits Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4 text-center">HRA Limits Breakdown</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getBreakdownData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 text-center mb-6">Monthly Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-600">HRA Received</div>
                <div className="text-xl font-bold text-gray-800">
                  ₹{(calculation.hraComponent / 12).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-600">HRA Exemption</div>
                <div className="text-xl font-bold text-green-600">
                  ₹{(calculation.hraExemption / 12).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-600">Taxable HRA</div>
                <div className="text-xl font-bold text-orange-600">
                  ₹{(calculation.taxableHra / 12).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-600">Monthly Tax Savings</div>
                <div className="text-xl font-bold text-green-600">
                  ₹{(getTaxSavings() / 12).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Calculation History */}
          {calculationHistory.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Calculations</h4>
              <div className="space-y-3">
                {calculationHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      HRA: ₹{item.data.hraComponent.toLocaleString('en-IN')} | 
                      Exemption: ₹{item.data.hraExemption.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Helpful Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <LightBulbIcon className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-4">
            <div>
              <div className="font-semibold text-amber-800 text-lg mb-2">💡 HRA Optimization Strategies</div>
              <div className="text-sm text-amber-700 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium mb-2">📋 Understanding HRA Limits:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>Actual HRA:</strong> What your company provides</li>
                      <li>• <strong>Rent - 10% Basic:</strong> Rent paid minus 10% of basic salary</li>
                      <li>• <strong>City Limit:</strong> 50% (metro) or 40% (non-metro) of basic salary</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium mb-2">🎯 Optimization Tips:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>Rent Planning:</strong> Calculate optimal rent for maximum benefits</li>
                      <li>• <strong>Documentation:</strong> Keep rent receipts and rental agreement</li>
                      <li>• <strong>City Consideration:</strong> Metro cities offer higher limits</li>
                      <li>• <strong>Tax Regime:</strong> HRA exemption only available in Old Tax Regime</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
