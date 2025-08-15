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
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

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

  const handleInputChange = (field: keyof HraCalculation, value: number | string) => {
    const newCalculation = { ...calculation, [field]: value };
    setCalculation(newCalculation);
    validateInputs(newCalculation);
  };

  const validateInputs = (data: HraCalculation) => {
    const newErrors: Record<string, string> = {};

    if (data.basicSalary <= 0) {
      newErrors.basicSalary = 'Basic salary must be greater than 0';
    }

    if (data.hraComponent <= 0) {
      newErrors.hraComponent = 'HRA component must be greater than 0';
    }

    if (data.hraComponent > data.basicSalary * 0.5) {
      newErrors.hraComponent = 'HRA cannot exceed 50% of basic salary';
    }

    if (scenario === 'A') {
      if (data.monthlyRent < 0) {
        newErrors.monthlyRent = 'Monthly rent cannot be negative';
      }
    } else {
      if (data.actualRentPaid < 0) {
        newErrors.actualRentPaid = 'Actual rent paid cannot be negative';
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

    setCalculation(prev => ({
      ...prev,
      hraExemption: Math.max(0, hraExemption),
      taxableHra,
      requiredRent: Math.round(requiredRent)
    }));
  };

  useEffect(() => {
    if (calculation.basicSalary > 0 && calculation.hraComponent > 0) {
      calculateHra();
    }
  }, [calculation.basicSalary, calculation.hraComponent, calculation.cityType, calculation.monthlyRent, calculation.actualRentPaid]);

  const getCityMultiplier = () => calculation.cityType === 'metro' ? 0.5 : 0.4;
  const getCityName = () => calculation.cityType === 'metro' ? 'Metro Cities' : 'Non-Metro Cities';

  return (
    <Card title="🏠 HRA Calculator" subtitle="Calculate HRA exemptions and optimize your tax savings" className="space-y-8">
      {/* Scenario Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Choose Your Scenario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setScenario('A')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              scenario === 'A'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="text-center space-y-2">
              <CalculatorIcon className="h-8 w-8 mx-auto" />
              <div className="font-semibold">Scenario A</div>
              <div className="text-sm opacity-80">Calculate required rent to fully utilize HRA</div>
            </div>
          </button>
          
          <button
            onClick={() => setScenario('B')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              scenario === 'B'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="text-center space-y-2">
              <HomeIcon className="h-8 w-8 mx-auto" />
              <div className="font-semibold">Scenario B</div>
              <div className="text-sm opacity-80">Calculate HRA exemption based on actual rent</div>
            </div>
          </button>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Input
          label="Basic Salary *"
          type="currency"
          value={calculation.basicSalary || 0}
          onChange={(value) => handleInputChange('basicSalary', value)}
          placeholder="Enter your basic salary"
          helperText="Your base salary before allowances"
          error={errors.basicSalary}
          className={errors.basicSalary ? 'ring-2 ring-red-200' : ''}
        />
        
        <Input
          label="HRA Component *"
          type="currency"
          value={calculation.hraComponent || 0}
          onChange={(value) => handleInputChange('hraComponent', value)}
          placeholder="Enter HRA amount"
          helperText="HRA provided by your company"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          >
            <option value="metro">Metro Cities (Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad)</option>
            <option value="non-metro">Non-Metro Cities (All other cities)</option>
          </select>
          <p className="text-xs text-gray-500">
            Metro cities: 50% of basic salary, Others: 40% of basic salary
          </p>
        </div>

        {scenario === 'A' ? (
          <Input
            label="Monthly Rent (Optional)"
            type="currency"
            value={calculation.monthlyRent || 0}
            onChange={(value) => handleInputChange('monthlyRent', value)}
            placeholder="Enter current rent if any"
            helperText="To see how much HRA exemption you'll get"
            error={errors.monthlyRent}
            className={errors.monthlyRent ? 'ring-2 ring-red-200' : ''}
          />
        ) : (
          <Input
            label="Actual Monthly Rent Paid *"
            type="currency"
            value={calculation.actualRentPaid || 0}
            onChange={(value) => handleInputChange('actualRentPaid', value)}
            placeholder="Enter rent you're paying"
            helperText="Monthly rent you actually pay"
            error={errors.actualRentPaid}
            className={errors.actualRentPaid ? 'ring-2 ring-red-200' : ''}
          />
        )}
      </div>

      {/* HRA Limits Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-2">HRA Exemption Limits:</div>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Actual HRA received:</strong> ₹{calculation.hraComponent?.toLocaleString('en-IN') || '0'}</li>
              <li>• <strong>Rent paid - 10% of basic salary:</strong> ₹{Math.max(0, (calculation.actualRentPaid || 0) - (calculation.basicSalary || 0) * 0.1).toLocaleString('en-IN')}</li>
              <li>• <strong>{getCityName()} limit:</strong> ₹{((calculation.basicSalary || 0) * getCityMultiplier()).toLocaleString('en-IN')} ({getCityMultiplier() * 100}% of basic salary)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Results */}
      {calculation.basicSalary > 0 && calculation.hraComponent > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 text-center">HRA Calculation Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HRA Exemption */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <span className="text-lg font-semibold text-green-800">HRA Exemption</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                ₹{calculation.hraExemption?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-green-600 mt-2">
                Tax-free amount annually
              </div>
            </div>

            {/* Taxable HRA */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-500" />
                <span className="text-lg font-semibold text-orange-800">Taxable HRA</span>
              </div>
              <div className="text-3xl font-bold text-orange-600">
                ₹{calculation.taxableHra?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-orange-600 mt-2">
                Amount subject to tax
              </div>
            </div>
          </div>

          {/* Scenario-specific results */}
          {scenario === 'A' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CalculatorIcon className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-semibold text-blue-800">Required Monthly Rent</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                ₹{calculation.requiredRent?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-blue-600 mt-2">
                To fully utilize your HRA component
              </div>
              <div className="mt-4 text-xs text-blue-700 bg-blue-100 rounded-lg p-3">
                <strong>Formula:</strong> HRA Component + (10% of Basic Salary) = ₹{calculation.hraComponent?.toLocaleString('en-IN') || '0'} + ₹{((calculation.basicSalary || 0) * 0.1).toLocaleString('en-IN')}
              </div>
            </div>
          )}

          {/* Monthly Breakdown */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">Monthly Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">HRA Received</div>
                <div className="text-xl font-bold text-gray-800">
                  ₹{(calculation.hraComponent / 12).toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">HRA Exemption</div>
                <div className="text-xl font-bold text-green-600">
                  ₹{(calculation.hraExemption / 12).toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Taxable HRA</div>
                <div className="text-xl font-bold text-orange-600">
                  ₹{(calculation.taxableHra / 12).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <div className="font-medium mb-1">💡 HRA Optimization Tips:</div>
            <ul className="space-y-1 text-xs">
              <li>• HRA exemption is the minimum of three amounts: actual HRA, rent paid minus 10% of basic salary, and city-based limit</li>
              <li>• Metro cities allow 50% of basic salary as HRA exemption, others allow 40%</li>
              <li>• You need to actually pay rent to claim HRA exemption</li>
              <li>• Keep rent receipts and rental agreement for tax filing</li>
              <li>• HRA exemption is only available under Old Tax Regime</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
