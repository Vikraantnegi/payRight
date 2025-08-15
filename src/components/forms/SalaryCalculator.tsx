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
  ArrowTrendingDownIcon,
  LightBulbIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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
  hraExemption: number;
  standardDeduction: number;
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
    effectiveTaxRate: 0,
    hraExemption: 0,
    standardDeduction: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTips, setShowTips] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<Array<{timestamp: Date, data: SalaryCalculation, breakdown: SalaryBreakdown}>>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleInputChange = (field: keyof SalaryCalculation, value: number | string) => {
    const newCalculation = { ...calculation, [field]: value };
    setCalculation(newCalculation);
    validateInputs(newCalculation);
  };

  const validateInputs = (data: SalaryCalculation) => {
    const newErrors: Record<string, string> = {};

    if (data.basicSalary <= 0) {
      newErrors.basicSalary = 'Basic salary must be greater than 0';
    } else if (data.basicSalary > 10000000) {
      newErrors.basicSalary = 'Basic salary seems unusually high. Please verify the amount.';
    }

    if (data.hra > data.basicSalary * 0.5) {
      newErrors.hra = `HRA cannot exceed 50% of basic salary (₹${(data.basicSalary * 0.5).toLocaleString('en-IN')})`;
    }

    if (data.epfContribution > data.basicSalary * 0.12) {
      newErrors.epfContribution = `EPF contribution cannot exceed 12% of basic salary (₹${(data.basicSalary * 0.12).toLocaleString('en-IN')})`;
    }

    if (data.transportAllowance > 19200) {
      newErrors.transportAllowance = 'Transport allowance above ₹19,200/year is taxable';
    }

    if (data.medicalAllowance > 15000) {
      newErrors.medicalAllowance = 'Medical allowance above ₹15,000/year is taxable';
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
    let standardDeduction = 0;
    let hraExemption = 0;

    if (taxRegime === 'old') {
      // Old regime: Standard deduction + HRA exemption
      standardDeduction = 50000;
      hraExemption = Math.min(
        hra,
        Math.max(0, (city === 'metro' ? basicSalary * 0.5 : basicSalary * 0.4) - (basicSalary * 0.1))
      );
      taxableIncome -= (standardDeduction + hraExemption);
    } else {
      // New regime: Only standard deduction
      standardDeduction = 75000;
      taxableIncome -= standardDeduction;
    }

    // Calculate tax (simplified tax calculation)
    const taxAmount = calculateTaxAmount(taxableIncome, taxRegime);
    
    // Calculate net salary
    const netSalary = grossSalary - totalDeductions - taxAmount;
    const monthlyInHand = netSalary / 12;
    const yearlyInHand = netSalary;
    const effectiveTaxRate = (taxAmount / grossSalary) * 100;

    const newBreakdown = {
      grossSalary,
      totalAllowances,
      totalDeductions,
      taxableIncome: Math.max(0, taxableIncome),
      taxAmount,
      netSalary,
      monthlyInHand,
      yearlyInHand,
      effectiveTaxRate,
      hraExemption,
      standardDeduction
    };

    setBreakdown(newBreakdown);
    
    // Add to calculation history
    setCalculationHistory(prev => [{
      timestamp: new Date(),
      data: calculation,
      breakdown: newBreakdown
    }, ...prev.slice(0, 4)]); // Keep last 5 calculations
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

  const getChartData = () => {
    if (breakdown.grossSalary === 0) return [];
    
    return [
      { name: 'Basic Salary', value: calculation.basicSalary, color: '#3b82f6' },
      { name: 'Allowances', value: breakdown.totalAllowances, color: '#10b981' },
      { name: 'Deductions', value: breakdown.totalDeductions, color: '#f59e0b' },
      { name: 'Taxes', value: breakdown.taxAmount, color: '#ef4444' }
    ].filter(item => item.value > 0);
  };

  const getMonthlyComparisonData = () => {
    if (breakdown.monthlyInHand === 0) return [];
    
    return [
      { month: 'Jan', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'Feb', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'Mar', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'Apr', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'May', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'Jun', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'Jul', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'Aug', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'Sep', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'Oct', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'Nov', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand },
      { month: 'Dec', gross: breakdown.grossSalary / 12, net: breakdown.monthlyInHand }
    ];
  };

  const getTaxRegimeComparison = () => {
    if (calculation.basicSalary === 0) return null;
    
    // Calculate for both regimes
    const oldRegimeTax = calculateTaxAmount(breakdown.taxableIncome + breakdown.standardDeduction + breakdown.hraExemption, 'old');
    const newRegimeTax = calculateTaxAmount(breakdown.taxableIncome + breakdown.standardDeduction, 'new');
    
    return {
      old: {
        tax: oldRegimeTax,
        netSalary: breakdown.grossSalary - breakdown.totalDeductions - oldRegimeTax,
        monthlyInHand: (breakdown.grossSalary - breakdown.totalDeductions - oldRegimeTax) / 12
      },
      new: {
        tax: newRegimeTax,
        netSalary: breakdown.grossSalary - breakdown.totalDeductions - newRegimeTax,
        monthlyInHand: (breakdown.grossSalary - breakdown.totalDeductions - newRegimeTax) / 12
      }
    };
  };

  return (
    <Card title="💰 In-Hand Salary Calculator" subtitle="Calculate your monthly take-home salary with detailed breakdowns and tax regime comparison" className="space-y-8">
      {/* Enhanced Tax Regime Selection */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Select Your Tax Regime</h3>
          <p className="text-gray-600">Choose the tax regime that applies to your situation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleInputChange('taxRegime', 'old')}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
              calculation.taxRegime === 'old'
                ? 'border-green-500 bg-green-50 text-green-700 shadow-lg scale-105'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md hover:scale-102'
            }`}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-4">
                <CheckCircleIcon className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg">Old Tax Regime</div>
                <div className="text-sm opacity-80">Full deductions available with higher tax rates</div>
                <div className="text-xs text-green-600 font-medium">Best for high deductions</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleInputChange('taxRegime', 'new')}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
              calculation.taxRegime === 'new'
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md hover:scale-102'
            }`}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
                <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg">New Tax Regime</div>
                <div className="text-sm opacity-80">Lower tax rates with limited deductions</div>
                <div className="text-xs text-blue-600 font-medium">Best for simplicity</div>
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
            <span className="font-semibold text-amber-800">💡 Salary Optimization Tips</span>
          </div>
          <span className="text-amber-600 text-sm">{showTips ? 'Hide' : 'Show'}</span>
        </button>
        
        {showTips && (
          <div className="mt-4 space-y-3 text-sm text-amber-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-2">🎯 Tax Regime Selection:</div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Old Regime:</strong> Choose if you have significant deductions</li>
                  <li>• <strong>New Regime:</strong> Choose for simplicity and lower rates</li>
                  <li>• <strong>Compare both</strong> to find the best option</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2">💰 Salary Components:</div>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Basic Salary:</strong> Affects EPF, gratuity, and HRA</li>
                  <li>• <strong>Allowances:</strong> Some are tax-free up to limits</li>
                  <li>• <strong>Deductions:</strong> Reduce taxable income</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* City Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          City Type *
        </label>
        <select
          value={calculation.city}
          onChange={(e) => handleInputChange('city', e.target.value as 'metro' | 'non-metro')}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
        >
          <option value="metro">🏙️ Metro Cities (Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad)</option>
          <option value="non-metro">🏘️ Non-Metro Cities (All other cities)</option>
        </select>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <InformationCircleIcon className="h-4 w-4" />
          <span>Affects HRA exemption limits and professional tax calculations</span>
        </div>
      </div>

      {/* Enhanced Salary Inputs */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Salary Components</h3>
          <p className="text-gray-600">Enter your salary details to calculate take-home pay</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Input
            label="Basic Salary *"
            type="currency"
            value={calculation.basicSalary || 0}
            onChange={(value) => handleInputChange('basicSalary', value)}
            placeholder="Enter your annual basic salary"
            helperText="Your base salary before allowances (affects EPF, gratuity, HRA)"
            error={errors.basicSalary}
            className={errors.basicSalary ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="HRA (House Rent Allowance)"
            type="currency"
            value={calculation.hra || 0}
            onChange={(value) => handleInputChange('hra', value)}
            placeholder="Enter annual HRA amount"
            helperText="Usually 40-50% of basic salary (tax-free under Old Regime)"
            error={errors.hra}
            className={errors.hra ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="Special Allowance"
            type="currency"
            value={calculation.specialAllowance || 0}
            onChange={(value) => handleInputChange('specialAllowance', value)}
            placeholder="Enter special allowance"
            helperText="Any special allowances provided by your company"
          />
          
          <Input
            label="Transport Allowance"
            type="currency"
            value={calculation.transportAllowance || 0}
            onChange={(value) => handleInputChange('transportAllowance', value)}
            placeholder="Enter transport allowance"
            helperText="Up to ₹19,200/year is tax-free (excess is taxable)"
            error={errors.transportAllowance}
            className={errors.transportAllowance ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="Medical Allowance"
            type="currency"
            value={calculation.medicalAllowance || 0}
            onChange={(value) => handleInputChange('medicalAllowance', value)}
            placeholder="Enter medical allowance"
            helperText="Up to ₹15,000/year is tax-free (excess is taxable)"
            error={errors.medicalAllowance}
            className={errors.medicalAllowance ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="Performance Bonus"
            type="currency"
            value={calculation.performanceBonus || 0}
            onChange={(value) => handleInputChange('performanceBonus', value)}
            placeholder="Enter performance bonus"
            helperText="Annual performance-based bonus (fully taxable)"
          />
          
          <Input
            label="Joining Bonus"
            type="currency"
            value={calculation.joiningBonus || 0}
            onChange={(value) => handleInputChange('joiningBonus', value)}
            placeholder="Enter joining bonus"
            helperText="One-time joining bonus (fully taxable)"
          />
          
          <Input
            label="RSUs/ESOPs"
            type="currency"
            value={calculation.rsus || 0}
            onChange={(value) => handleInputChange('rsus', value)}
            placeholder="Enter RSU value"
            helperText="Annual value of stock grants (taxable when vested)"
          />
          
          <Input
            label="Other Allowances"
            type="currency"
            value={calculation.otherAllowances || 0}
            onChange={(value) => handleInputChange('otherAllowances', value)}
            placeholder="Enter other allowances"
            helperText="Any other allowances or benefits"
          />
        </div>
      </div>

      {/* Enhanced Deductions */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">Deductions & Contributions</h3>
          <p className="text-gray-600">These reduce your taxable income</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Input
            label="EPF Contribution"
            type="currency"
            value={calculation.epfContribution || 0}
            onChange={(value) => handleInputChange('epfContribution', value)}
            placeholder="Enter EPF contribution"
            helperText="Usually 12% of basic salary (tax-deductible)"
            error={errors.epfContribution}
            className={errors.epfContribution ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="Professional Tax"
            type="currency"
            value={calculation.professionalTax || 0}
            onChange={(value) => handleInputChange('professionalTax', value)}
            helperText="Varies by state (₹200-₹2,500/year, tax-deductible)"
          />
        </div>
      </div>

      {/* Enhanced Results */}
      {calculation.basicSalary > 0 && (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Your Salary Breakdown</h3>
            <p className="text-gray-600">Comprehensive analysis of your earnings and deductions</p>
          </div>
          
          {/* Tax Regime Info */}
          <div className={`p-6 rounded-2xl border ${getTaxRegimeBg(calculation.taxRegime)}`}>
            <div className="text-center space-y-3">
              <div className={`text-xl font-semibold ${getTaxRegimeColor(calculation.taxRegime)}`}>
                {calculation.taxRegime === 'old' ? 'Old Tax Regime' : 'New Tax Regime'} Selected
              </div>
              <div className="text-sm text-gray-600">
                {calculation.taxRegime === 'old' 
                  ? `Standard Deduction: ₹${breakdown.standardDeduction.toLocaleString('en-IN')} | HRA Exemption: ₹${breakdown.hraExemption.toLocaleString('en-IN')}`
                  : `Standard Deduction: ₹${breakdown.standardDeduction.toLocaleString('en-IN')} | No HRA exemption`
                }
              </div>
            </div>
          </div>

          {/* Key Figures */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gross Salary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CurrencyRupeeIcon className="h-7 w-7 text-blue-500" />
                <span className="text-lg font-semibold text-blue-800">Gross Salary</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ₹{breakdown.grossSalary?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-blue-600">Annual total before deductions</div>
            </div>

            {/* Net Salary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CheckCircleIcon className="h-7 w-7 text-green-500" />
                <span className="text-lg font-semibold text-green-800">Net Salary</span>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                ₹{breakdown.netSalary?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-green-600">Annual take-home after tax</div>
            </div>

            {/* Monthly In-Hand */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <BanknotesIcon className="h-7 w-7 text-purple-500" />
                <span className="text-lg font-semibold text-purple-800">Monthly In-Hand</span>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                ₹{breakdown.monthlyInHand?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-sm text-purple-600">Your monthly take-home</div>
            </div>

            {/* Effective Tax Rate */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <CalculatorIcon className="h-7 w-7 text-orange-500" />
                <span className="text-lg font-semibold text-orange-800">Tax Rate</span>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {breakdown.effectiveTaxRate?.toFixed(1) || '0'}%
              </div>
              <div className="text-sm text-orange-600">Effective tax rate</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800 text-center">Visual Breakdown</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Salary Composition Chart */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4 text-center">Salary Composition</h5>
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

              {/* Monthly Comparison Chart */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4 text-center">Monthly Comparison</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getMonthlyComparisonData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                    <Line type="monotone" dataKey="gross" stroke="#3b82f6" strokeWidth={2} name="Gross" />
                    <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2} name="Net" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tax Regime Comparison */}
          {getTaxRegimeComparison() && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
              <div className="text-center space-y-4 mb-6">
                <h4 className="text-xl font-semibold text-indigo-800">Tax Regime Comparison</h4>
                <p className="text-indigo-600">See how your salary would differ under both tax regimes</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Old Regime */}
                <div className="bg-white rounded-xl p-6 border border-green-200">
                  <div className="text-center space-y-3">
                    <div className="text-lg font-semibold text-green-800">Old Tax Regime</div>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{getTaxRegimeComparison()?.old.monthlyInHand.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-green-600">Monthly In-Hand</div>
                    <div className="text-xs text-gray-500">
                      Tax: ₹{getTaxRegimeComparison()?.old.tax.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* New Regime */}
                <div className="bg-white rounded-xl p-6 border border-blue-200">
                  <div className="text-center space-y-3">
                    <div className="text-lg font-semibold text-blue-800">New Tax Regime</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{getTaxRegimeComparison()?.new.monthlyInHand.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-blue-600">Monthly In-Hand</div>
                    <div className="text-xs text-gray-500">
                      Tax: ₹{getTaxRegimeComparison()?.new.tax.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-indigo-200">
                  <LightBulbIcon className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-800">
                    {getTaxRegimeComparison()?.old.monthlyInHand > getTaxRegimeComparison()?.new.monthlyInHand 
                      ? 'Old Tax Regime gives you higher take-home pay'
                      : 'New Tax Regime gives you higher take-home pay'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Breakdown */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 text-center mb-6">Detailed Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Gross Salary:</span>
                <span className="font-semibold text-gray-900">₹{breakdown.grossSalary?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Total Allowances:</span>
                <span className="font-semibold text-blue-600">+₹{breakdown.totalAllowances?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Total Deductions:</span>
                <span className="font-semibold text-red-600">-₹{breakdown.totalDeductions?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Standard Deduction:</span>
                <span className="font-semibold text-green-600">-₹{breakdown.standardDeduction?.toLocaleString('en-IN') || '0'}</span>
              </div>
              {calculation.taxRegime === 'old' && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-700 font-medium">HRA Exemption:</span>
                  <span className="font-semibold text-green-600">-₹{breakdown.hraExemption?.toLocaleString('en-IN') || '0'}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Taxable Income:</span>
                <span className="font-semibold text-gray-900">₹{breakdown.taxableIncome?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Income Tax:</span>
                <span className="font-semibold text-red-600">-₹{breakdown.taxAmount?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="flex justify-between items-center py-3 font-semibold text-gray-800 bg-gray-100 px-4 py-3 rounded-xl">
                <span>Net Salary:</span>
                <span className="text-lg">₹{breakdown.netSalary?.toLocaleString('en-IN') || '0'}</span>
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
                      Basic: ₹{item.data.basicSalary.toLocaleString('en-IN')} | 
                      Net: ₹{item.breakdown.monthlyInHand.toLocaleString('en-IN')}/month
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
              <div className="font-semibold text-amber-800 text-lg mb-2">💡 Salary Optimization Strategies</div>
              <div className="text-sm text-amber-700 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium mb-2">📋 Understanding Your Salary:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>Basic Salary:</strong> Foundation for EPF, gratuity, and HRA</li>
                      <li>• <strong>Allowances:</strong> Some are tax-free up to specific limits</li>
                      <li>• <strong>Deductions:</strong> Reduce your taxable income</li>
                      <li>• <strong>Tax Regime:</strong> Choose based on your deduction profile</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium mb-2">🎯 Optimization Tips:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>EPF:</strong> Contribute maximum for tax benefits</li>
                      <li>• <strong>HRA:</strong> Optimize rent to maximize exemptions</li>
                      <li>• <strong>Allowances:</strong> Stay within tax-free limits</li>
                      <li>• <strong>Comparison:</strong> Always compare both tax regimes</li>
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
