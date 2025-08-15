'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useTax } from '@/lib/TaxContext';
import { formatCurrency } from '@/utils/formatters';

export function IncomeForm() {
  const { state, updateIncome } = useTax();
  const { income } = state;

  const handleIncomeChange = (field: keyof typeof income, value: number) => {
    updateIncome({ [field]: value });
  };

  const totalIncome = Object.values(income).reduce((sum, value) => sum + value, 0);

  return (
    <Card 
      title="Income Details" 
      subtitle="Enter your annual income from all sources"
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Salary */}
        <Input
          label="Basic Salary"
          value={income.basicSalary}
          onChange={(value) => handleIncomeChange('basicSalary', value)}
          type="currency"
          required
          helperText="Your base salary before any allowances"
        />

        {/* HRA */}
        <Input
          label="HRA (House Rent Allowance)"
          value={income.hra}
          onChange={(value) => handleIncomeChange('hra', value)}
          type="currency"
          helperText="House rent allowance from your employer"
        />

        {/* Special Allowance */}
        <Input
          label="Special Allowance"
          value={income.specialAllowance}
          onChange={(value) => handleIncomeChange('specialAllowance', value)}
          type="currency"
          helperText="Any special allowances or bonuses"
        />

        {/* Transport Allowance */}
        <Input
          label="Transport Allowance"
          value={income.transportAllowance}
          onChange={(value) => handleIncomeChange('transportAllowance', value)}
          type="currency"
          helperText="Transportation allowance (up to ₹19,200/year tax-free)"
        />

        {/* Medical Allowance */}
        <Input
          label="Medical Allowance"
          value={income.medicalAllowance}
          onChange={(value) => handleIncomeChange('medicalAllowance', value)}
          type="currency"
          helperText="Medical allowance (up to ₹15,000/year tax-free)"
        />

        {/* Performance Bonus */}
        <Input
          label="Performance Bonus"
          value={income.performanceBonus}
          onChange={(value) => handleIncomeChange('performanceBonus', value)}
          type="currency"
          helperText="Performance-based bonuses or incentives"
        />

        {/* Joining Bonus */}
        <Input
          label="Joining Bonus"
          value={income.joiningBonus}
          onChange={(value) => handleIncomeChange('joiningBonus', value)}
          type="currency"
          helperText="One-time joining bonus or sign-on bonus"
        />

        {/* RSUs/ESOPs */}
        <Input
          label="RSUs/ESOPs"
          value={income.rsus}
          onChange={(value) => handleIncomeChange('rsus', value)}
          type="currency"
          helperText="Restricted Stock Units or Employee Stock Options"
        />

        {/* Other Allowances */}
        <Input
          label="Other Allowances"
          value={income.otherAllowances}
          onChange={(value) => handleIncomeChange('otherAllowances', value)}
          type="currency"
          helperText="Any other allowances not covered above"
        />
      </div>

      {/* Total Income Summary */}
      <div className="mt-10 p-8 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-blue-50/80 rounded-2xl border border-blue-200/50 shadow-lg">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-blue-900">Total Annual Income:</span>
          <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {formatCurrency(totalIncome)}
          </span>
        </div>
        <div className="text-base text-blue-700 mt-3 opacity-90">
          Monthly: {formatCurrency(totalIncome / 12)}
        </div>
      </div>
    </Card>
  );
}
