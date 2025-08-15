'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { 
  BanknotesIcon, 
  CalculatorIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface SalaryCalculation {
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  transportAllowance: number;
  medicalAllowance: number;
  performanceBonus: number;
  joiningBonus: number;
  rsus: number;
  otherAllowances: number;
  epfContribution: number;
  professionalTax: number;
  taxRegime: 'old' | 'new';
  city: 'metro' | 'non-metro';
}

interface SalaryBreakdown {
  grossSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  taxableIncome: number;
  taxAmount: number;
  netSalary: number;
  monthlyInHand: number;
  yearlyInHand: number;
  effectiveTaxRate: number;
}

export function SalaryCalculator() {
  const [calculation, setCalculation] = useState<SalaryCalculation>({
    basicSalary: 0,
    hra: 0,
    specialAllowance: 0,
    transportAllowance: 0,
    medicalAllowance: 0,
    performanceBonus: 0,
    joiningBonus: 0,
    rsus: 0,
    otherAllowances: 0,
    epfContribution: 0,
    professionalTax: 0,
    taxRegime: 'old',
    city: 'metro'
  });

  const [breakdown, setBreakdown] = useState<SalaryBreakdown>({
    grossSalary: 0,
    totalAllowances: 0,
    totalDeductions: 0,
    taxableIncome: 0,
    taxAmount: 0,
    netSalary: 0,
    monthlyInHand: 0,
    yearlyInHand: 0,
    effectiveTaxRate: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof SalaryCalculation, value: number | string) => {
    const newCalculation = { ...calculation, [field]: value };
    setCalculation(newCalculation);
    validateInputs(newCalculation);
  };

  const validateInputs = (data: SalaryCalculation) => {
    const newErrors: Record<string, string> = {};

    if (data.basicSalary <= 0) {
      newErrors.basicSalary = 'Basic salary must be greater than 0';
    }

    if (data.hra > data.basicSalary * 0.5) {
      newErrors.hra = 'HRA cannot exceed 50% of basic salary';
    }

    if (data.epfContribution > data.basicSalary * 0.12) {
      newErrors.epfContribution = 'EPF contribution cannot exceed 12% of basic salary';
    }

    setErrors(newErrors);
  };

  const calculateSalary = () => {
    if (Object.keys(errors).length > 0) return;

    const {
      basicSalary,
      hra,
      specialAllowance,
      transportAllowance,
      medicalAllowance,
      performanceBonus,
      joiningBonus,
      rsus,
      otherAllowances,
      epfContribution,
      professionalTax,
      taxRegime,
      city
    } = calculation;

    // Calculate gross salary
    const grossSalary = basicSalary + hra + specialAllowance + transportAllowance + 
                       medicalAllowance + performanceBonus + joiningBonus + rsus + otherAllowances;

    // Calculate total allowances
    const totalAllowances = hra + specialAllowance + transportAllowance + 
                           medicalAllowance + performanceBonus + joiningBonus + rsus + otherAllowances;

    // Calculate deductions
    const totalDeductions = epfContribution + professionalTax;

    // Calculate taxable income (simplified for this calculator)
    let taxableIncome = grossSalary - totalDeductions;
    
    // Apply tax regime specific deductions
    if (taxRegime === 'old') {
      // Old regime: Standard deduction + HRA exemption
      const standardDeduction = 50000;
      const hraExemption = Math.min(
        hra,
        Math.max(0, (city === 'metro' ? basicSalary * 0.5 : basicSalary * 0.4) - (basicSalary * 0.1))
      );
      taxableIncome -= (standardDeduction + hraExemption);
    } else {
      // New regime: Only standard deduction
      const standardDeduction = 75000;
      taxableIncome -= standardDeduction;
    }

    // Calculate tax (simplified tax calculation)
    const taxAmount = calculateTaxAmount(taxableIncome, taxRegime);
    
    // Calculate net salary
    const netSalary = grossSalary - totalDeductions - taxAmount;
    const monthlyInHand = netSalary / 12;
    const yearlyInHand = netSalary;
    const effectiveTaxRate = (taxAmount / grossSalary) * 100;

    setBreakdown({
      grossSalary,
      totalAllowances,
      totalDeductions,
      taxableIncome: Math.max(0, taxableIncome),
      taxAmount,
      netSalary,
      monthlyInHand,
      yearlyInHand,
      effectiveTaxRate
    });
  };

  const calculateTaxAmount = (taxableIncome: number, regime: 'old' | 'new'): number => {
    if (taxableIncome <= 0) return 0;

    let taxAmount = 0;
    
    if (regime === 'old') {
      // Old regime tax slabs
      if (taxableIncome <= 300000) {
        taxAmount = 0;
      } else if (taxableIncome <= 600000) {
        taxAmount = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 900000) {
        taxAmount = 15000 + (taxableIncome - 600000) * 0.1;
      } else if (taxableIncome <= 1200000) {
        taxAmount = 45000 + (taxableIncome - 900000) * 0.15;
      } else if (taxableIncome <= 1500000) {
        taxAmount = 90000 + (taxableIncome - 1200000) * 0.2;
      } else {
        taxAmount = 150000 + (taxableIncome - 1500000) * 0.3;
      }
    } else {
      // New regime tax slabs (FY 2025-26)
      if (taxableIncome <= 400000) {
        taxAmount = 0;
      } else if (taxableIncome <= 800000) {
        taxAmount = (taxableIncome - 400000) * 0.05;
      } else if (taxableIncome <= 1200000) {
        taxAmount = 20000 + (taxableIncome - 800000) * 0.1;
      } else if (taxableIncome <= 1600000) {
        taxAmount = 60000 + (taxableIncome - 1200000) * 0.15;
      } else if (taxableIncome <= 2000000) {
        taxAmount = 120000 + (taxableIncome - 1600000) * 0.2;
      } else if (taxableIncome <= 2400000) {
        taxAmount = 200000 + (taxableIncome - 2000000) * 0.25;
      } else {
        taxAmount = 300000 + (taxableIncome - 2400000) * 0.3;
      }
    }

    return Math.round(taxAmount);
  };

  useEffect(() => {
    if (calculation.basicSalary > 0) {
      calculateSalary();
    }
  }, [calculation]);

  const getTaxRegimeColor = (regime: 'old' | 'new') => {
    return regime === 'old' ? 'text-green-600' : 'text-blue-600';
  };

  const getTaxRegimeBg = (regime: 'old' | 'new') => {
    return regime === 'old' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200';
  };

  return (
    <Card title="💰 In-Hand Salary Calculator" subtitle="Calculate your monthly take-home salary with detailed breakdowns" className="space-y-8">
      {/* Tax Regime Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Tax Regime</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleInputChange('taxRegime', 'old')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              calculation.taxRegime === 'old'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="text-center space-y-2">
              <CheckCircleIcon className="h-8 w-8 mx-auto" />
              <div className="font-semibold">Old Tax Regime</div>
              <div className="text-sm opacity-80">Full deductions available</div>
            </div>
          </button>
          
          <button
            onClick={() => handleInputChange('taxRegime', 'new')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              calculation.taxRegime === 'new'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="text-center space-y-2">
              <ArrowTrendingUpIcon className="h-8 w-8 mx-auto" />
              <div className="font-semibold">New Tax Regime</div>
              <div className="text-sm opacity-80">Lower rates, limited deductions</div>
            </div>
          </button>
        </div>
      </div>

      {/* City Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          City Type *
        </label>
        <select
          value={calculation.city}
          onChange={(e) => handleInputChange('city', e.target.value as 'metro' | 'non-metro')}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
        >
          <option value="metro">Metro Cities (Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad)</option>
          <option value="non-metro">Non-Metro Cities (All other cities)</option>
        </select>
        <p className="text-xs text-gray-500">
          Affects HRA exemption limits and professional tax
        </p>
      </div>

      {/* Salary Inputs */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Salary Components</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Input
            label="Basic Salary *"
            type="currency"
            value={calculation.basicSalary || 0}
            onChange={(value) => handleInputChange('basicSalary', value)}
            placeholder="Enter basic salary"
            helperText="Your base salary before allowances"
            error={errors.basicSalary}
            className={errors.basicSalary ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="HRA (House Rent Allowance)"
            type="currency"
            value={calculation.hra || 0}
            onChange={(value) => handleInputChange('hra', value)}
            placeholder="Enter HRA amount"
            helperText="Usually 40-50% of basic salary"
            error={errors.hra}
            className={errors.hra ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="Special Allowance"
            type="currency"
            value={calculation.specialAllowance || 0}
            onChange={(value) => handleInputChange('specialAllowance', value)}
            placeholder="Enter special allowance"
            helperText="Any special allowances"
          />
          
          <Input
            label="Transport Allowance"
            type="currency"
            value={calculation.transportAllowance || 0}
            onChange={(value) => handleInputChange('transportAllowance', value)}
            placeholder="Enter transport allowance"
            helperText="Up to ₹19,200/year tax-free"
          />
          
          <Input
            label="Medical Allowance"
            type="currency"
            value={calculation.medicalAllowance || 0}
            onChange={(value) => handleInputChange('medicalAllowance', value)}
            placeholder="Enter medical allowance"
            helperText="Up to ₹15,000/year tax-free"
          />
          
          <Input
            label="Performance Bonus"
            type="currency"
            value={calculation.performanceBonus || 0}
            onChange={(value) => handleInputChange('performanceBonus', value)}
            placeholder="Enter performance bonus"
            helperText="Annual performance bonus"
          />
          
          <Input
            label="Joining Bonus"
            type="currency"
            value={calculation.joiningBonus || 0}
            onChange={(value) => handleInputChange('joiningBonus', value)}
            placeholder="Enter joining bonus"
            helperText="One-time joining bonus"
          />
          
          <Input
            label="RSUs/ESOPs"
            type="currency"
            value={calculation.rsus || 0}
            onChange={(value) => handleInputChange('rsus', value)}
            placeholder="Enter RSU value"
            helperText="Annual value of stock grants"
          />
          
          <Input
            label="Other Allowances"
            type="currency"
            value={calculation.otherAllowances || 0}
            onChange={(value) => handleInputChange('otherAllowances', value)}
            placeholder="Enter other allowances"
            helperText="Any other allowances"
          />
        </div>
      </div>

      {/* Deductions */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Deductions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Input
            label="EPF Contribution"
            type="currency"
            value={calculation.epfContribution || 0}
            onChange={(value) => handleInputChange('epfContribution', value)}
            placeholder="Enter EPF contribution"
            helperText="Usually 12% of basic salary"
            error={errors.epfContribution}
            className={errors.epfContribution ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="Professional Tax"
            type="currency"
            value={calculation.professionalTax || 0}
            onChange={(value) => handleInputChange('professionalTax', value)}
            placeholder="Enter professional tax"
            helperText="Varies by state (₹200-₹2,500/year)"
          />
        </div>
      </div>

      {/* Results */}
      {calculation.basicSalary > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Salary Breakdown</h3>
          
          {/* Tax Regime Info */}
          <div className={`p-4 rounded-lg border ${getTaxRegimeBg(calculation.taxRegime)}`}>
            <div className="text-center">
              <div className={`text-lg font-semibold ${getTaxRegimeColor(calculation.taxRegime)}`}>
                {calculation.taxRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime'} Selected
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {calculation.taxRegime === 'old' 
                  ? 'Full deductions available with higher tax rates' 
                  : 'Lower tax rates with limited deductions'
                }
              </div>
            </div>
          </div>

          {/* Key Figures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gross Salary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CurrencyRupeeIcon className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-semibold text-blue-800">Gross Salary</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                ₹{breakdown.grossSalary?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-blue-600 mt-2">
                Annual total before deductions
              </div>
            </div>

            {/* Net Salary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <span className="text-lg font-semibold text-green-800">Net Salary</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                ₹{breakdown.netSalary?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-green-600 mt-2">
                Annual take-home after tax
              </div>
            </div>

            {/* Monthly In-Hand */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <BanknotesIcon className="h-6 w-6 text-purple-500" />
                <span className="text-lg font-semibold text-purple-800">Monthly In-Hand</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">
                ₹{breakdown.monthlyInHand?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-purple-600 mt-2">
                Your monthly take-home
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">Detailed Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Gross Salary:</span>
                <span className="font-semibold text-gray-900">₹{breakdown.grossSalary?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Total Allowances:</span>
                <span className="font-semibold text-blue-600">+₹{breakdown.totalAllowances?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Total Deductions:</span>
                <span className="font-semibold text-red-600">-₹{breakdown.totalDeductions?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Taxable Income:</span>
                <span className="font-semibold text-gray-900">₹{breakdown.taxableIncome?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Income Tax:</span>
                <span className="font-semibold text-red-600">-₹{breakdown.taxAmount?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-2 font-semibold text-gray-800 bg-gray-100 px-3 py-2 rounded-lg">
                <span>Net Salary:</span>
                <span className="text-lg">₹{breakdown.netSalary?.toLocaleString('en-IN') || '0'}</span>
              </div>
            </div>
          </div>

          {/* Tax Analysis */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <CalculatorIcon className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-semibold text-orange-800">Tax Analysis</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Effective Tax Rate</div>
                <div className="text-2xl font-bold text-orange-600">
                  {breakdown.effectiveTaxRate?.toFixed(1) || '0'}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Monthly Tax</div>
                <div className="text-2xl font-bold text-orange-600">
                  ₹{(breakdown.taxAmount / 12)?.toLocaleString('en-IN') || '0'}
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
            <div className="font-medium mb-1">💡 Salary Optimization Tips:</div>
            <ul className="space-y-1 text-xs">
              <li>• Basic salary affects EPF, gratuity, and HRA calculations</li>
              <li>• Transport allowance up to ₹19,200/year is tax-free</li>
              <li>• Medical allowance up to ₹15,000/year is tax-free</li>
              <li>• EPF contribution is usually 12% of basic salary</li>
              <li>• Professional tax varies by state and income level</li>
              <li>• Consider tax regime choice based on your deductions</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
