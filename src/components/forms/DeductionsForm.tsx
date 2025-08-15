'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useTax } from '@/lib/TaxContext';
import { formatCurrency } from '@/utils/formatters';
import { TaxCalculator } from '@/lib/taxCalculator';

export function DeductionsForm() {
  const { state, updateDeductions } = useTax();
  const { deductions } = state;

  const handleDeductionChange = (field: keyof typeof deductions, value: number) => {
    updateDeductions({ [field]: value });
  };

  const totalDeductions = Object.values(deductions).reduce((sum, value) => sum + value, 0);
  const eightyCLimit = TaxCalculator.calculate80CLimitUtilization(deductions);

  return (
    <Card 
      title="Deductions & Exemptions" 
      subtitle="Enter your tax-saving investments and exemptions (Old Tax Regime only)"
      className="space-y-8"
    >
      {/* 80C Investments Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-3">
          <h4 className="text-lg font-semibold text-gray-800">
            80C Investments (Limit: ₹1,50,000)
          </h4>
          <p className="text-sm text-gray-600 mt-1">Tax-saving investments under Section 80C</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="ELSS (Equity Linked Savings Scheme)"
            value={deductions.elss}
            onChange={(value) => handleDeductionChange('elss', value)}
            type="currency"
            helperText="Tax-saving mutual funds"
          />
          
          <Input
            label="PPF (Public Provident Fund)"
            value={deductions.ppf}
            onChange={(value) => handleDeductionChange('ppf', value)}
            type="currency"
            helperText="Public Provident Fund contributions"
          />
          
          <Input
            label="EPF (Employee Provident Fund)"
            value={deductions.epf}
            onChange={(value) => handleDeductionChange('epf', value)}
            type="currency"
            helperText="Employee Provident Fund contributions"
          />
          
          <Input
            label="Life Insurance Premium"
            value={deductions.lifeInsurance}
            onChange={(value) => handleDeductionChange('lifeInsurance', value)}
            type="currency"
            helperText="Life insurance premium payments"
          />
          
          <Input
            label="NPS (National Pension System)"
            value={deductions.nps}
            onChange={(value) => handleDeductionChange('nps', value)}
            type="currency"
            helperText="NPS contributions (additional ₹50,000 limit)"
          />
          
          <Input
            label="Home Loan Principal"
            value={deductions.homeLoanPrincipal}
            onChange={(value) => handleDeductionChange('homeLoanPrincipal', value)}
            type="currency"
            helperText="Home loan principal repayment"
          />
          
          <Input
            label="Sukanya Samriddhi"
            value={deductions.sukanyaSamriddhi}
            onChange={(value) => handleDeductionChange('sukanyaSamriddhi', value)}
            type="currency"
            helperText="Sukanya Samriddhi Yojana"
          />
          
          <Input
            label="NSC (National Savings Certificate)"
            value={deductions.nsc}
            onChange={(value) => handleDeductionChange('nsc', value)}
            type="currency"
            helperText="National Savings Certificate"
          />
          
          <Input
            label="Tax Saving FD"
            value={deductions.taxSavingFd}
            onChange={(value) => handleDeductionChange('taxSavingFd', value)}
            type="currency"
            helperText="Tax-saving fixed deposits"
          />
        </div>
        
        {/* 80C Limit Progress */}
        <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-green-800">80C Limit Utilization</span>
            <span className="text-sm font-semibold text-green-800">
              {eightyCLimit.used.toLocaleString()}/{eightyCLimit.limit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-3 mb-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${eightyCLimit.utilizationPercentage}%` }}
            ></div>
          </div>
          <div className="text-sm text-green-700">
            {eightyCLimit.utilizationPercentage}% used • ₹{eightyCLimit.remaining.toLocaleString()} remaining
          </div>
        </div>
      </div>

      {/* 80D Health Insurance Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-3">
          <h4 className="text-lg font-semibold text-gray-800">
            80D Health Insurance
          </h4>
          <p className="text-sm text-gray-600 mt-1">Health insurance premium deductions</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Health Insurance (Self & Family)"
            value={deductions.healthInsuranceSelf}
            onChange={(value) => handleDeductionChange('healthInsuranceSelf', value)}
            type="currency"
            helperText="Limit: ₹25,000 (₹50,000 for senior citizens)"
          />
          
          <Input
            label="Health Insurance (Parents)"
            value={deductions.healthInsuranceParents}
            onChange={(value) => handleDeductionChange('healthInsuranceParents', value)}
            type="currency"
            helperText="Limit: ₹25,000 (₹50,000 for senior citizens)"
          />
          
          <Input
            label="Preventive Health Checkup"
            value={deductions.preventiveHealthCheckup}
            onChange={(value) => handleDeductionChange('preventiveHealthCheckup', value)}
            type="currency"
            helperText="Limit: ₹5,000 (included in 80D limit)"
          />
        </div>
      </div>

      {/* Other Deductions Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-3">
          <h4 className="text-lg font-semibold text-gray-800">
            Other Deductions & Exemptions
          </h4>
          <p className="text-sm text-gray-600 mt-1">Additional tax-saving opportunities</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="HRA Exemption"
            value={deductions.hraExemption}
            onChange={(value) => handleDeductionChange('hraExemption', value)}
            type="currency"
            helperText="HRA exemption based on rent paid"
          />
          
          <Input
            label="LTA (Leave Travel Allowance)"
            value={deductions.lta}
            onChange={(value) => handleDeductionChange('lta', value)}
            type="currency"
            helperText="Leave travel allowance exemption"
          />
          
          <Input
            label="Home Loan Interest"
            value={deductions.homeLoanInterest}
            onChange={(value) => handleDeductionChange('homeLoanInterest', value)}
            type="currency"
            helperText="Home loan interest deduction (80C)"
          />
          
          <Input
            label="80G Donations"
            value={deductions.donations}
            onChange={(value) => handleDeductionChange('donations', value)}
            type="currency"
            helperText="Donations to registered charities"
          />
          
          <Input
            label="Interest on Savings (80TTA)"
            value={deductions.interestOnSavings}
            onChange={(value) => handleDeductionChange('interestOnSavings', value)}
            type="currency"
            helperText="Interest on savings account (limit: ₹10,000)"
          />
        </div>
      </div>

      {/* Total Deductions Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-green-900">Total Deductions:</span>
          <span className="text-3xl font-bold text-green-900">
            {formatCurrency(totalDeductions)}
          </span>
        </div>
        <div className="text-sm text-green-700 mt-2">
          Note: Most deductions are only applicable under Old Tax Regime
        </div>
      </div>
    </Card>
  );
}
