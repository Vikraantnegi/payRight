'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useTax } from '@/lib/TaxContext';
import { formatCurrency } from '@/utils/formatters';

export function IncomeForm() {
  const { state, updateIncome } = useTax();
  const { income } = state;

  const handleInputChange = (field: keyof typeof income, value: number) => {
    updateIncome({ ...income, [field]: value });
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
          label="Basic Salary *"
          type="currency"
          value={income.basicSalary || 0}
          onChange={(value) => handleInputChange('basicSalary', value)}
          placeholder="Enter basic salary"
          helperText="Your base salary before any allowances"
          required
        />

        {/* HRA */}
        <Input
          label="HRA (House Rent Allowance)"
          type="currency"
          value={income.hra || 0}
          onChange={(value) => handleInputChange('hra', value)}
          placeholder="Enter HRA amount"
          helperText="House rent allowance from your employer"
        />

        {/* Special Allowance */}
        <Input
          label="Special Allowance"
          type="currency"
          value={income.specialAllowance || 0}
          onChange={(value) => handleInputChange('specialAllowance', value)}
          placeholder="Enter special allowance"
          helperText="Any special allowances or bonuses"
        />

        {/* Transport Allowance */}
        <Input
          label="Transport Allowance"
          type="currency"
          value={income.transportAllowance || 0}
          onChange={(value) => handleInputChange('transportAllowance', value)}
          placeholder="Enter transport allowance"
          helperText="Transportation allowance (up to ₹19,200/year tax-free)"
        />

        {/* Medical Allowance */}
        <Input
          label="Medical Allowance"
          type="currency"
          value={income.medicalAllowance || 0}
          onChange={(value) => handleInputChange('medicalAllowance', value)}
          placeholder="Enter medical allowance"
          helperText="Medical allowance (up to ₹15,000/year tax-free)"
        />

        {/* Performance Bonus */}
        <Input
          label="Performance Bonus"
          type="currency"
          value={income.performanceBonus || 0}
          onChange={(value) => handleInputChange('performanceBonus', value)}
          placeholder="Enter performance bonus"
          helperText="Performance-based bonuses or incentives"
        />

        {/* Joining Bonus */}
        <Input
          label="Joining Bonus"
          type="currency"
          value={income.joiningBonus || 0}
          onChange={(value) => handleInputChange('joiningBonus', value)}
          placeholder="Enter joining bonus"
          helperText="One-time joining bonus or sign-on"
        />

        {/* RSUs/ESOPs */}
        <Input
          label="RSUs/ESOPs"
          type="currency"
          value={income.rsus || 0}
          onChange={(value) => handleInputChange('rsus', value)}
          placeholder="Enter RSUs/ESOPs value"
          helperText="Restricted Stock Units or Employee Stock Options"
        />

        {/* Other Allowances */}
        <Input
          label="Other Allowances"
          type="currency"
          value={income.otherAllowances || 0}
          onChange={(value) => handleInputChange('otherAllowances', value)}
          placeholder="Enter other allowances"
          helperText="Any other allowances or benefits"
        />
      </div>

      {/* Total Income Summary */}
      <div className="mt-10 p-6 bg-gradient-to-r from-blue-50/60 via-indigo-50/60 to-blue-50/60 rounded-xl border border-blue-200/40 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-blue-800">Total Annual Income:</span>
          <span className="text-3xl font-semibold text-blue-800">
            {formatCurrency(totalIncome)}
          </span>
        </div>
        <div className="text-sm text-blue-600 mt-2 opacity-80">
          Monthly: {formatCurrency(totalIncome / 12)}
        </div>
      </div>
    </Card>
  );
}
