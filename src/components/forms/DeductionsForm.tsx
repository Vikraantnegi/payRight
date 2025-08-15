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

  const handleInputChange = (field: keyof typeof deductions, value: number) => {
    updateDeductions({ ...deductions, [field]: value });
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
          {/* ELSS */}
          <Input
            label="ELSS (Equity Linked Savings Scheme)"
            type="currency"
            value={deductions.elss || 0}
            onChange={(value) => handleInputChange('elss', value)}
            placeholder="Enter ELSS amount"
            helperText="Tax-saving mutual funds"
          />

          {/* PPF */}
          <Input
            label="PPF (Public Provident Fund)"
            type="currency"
            value={deductions.ppf || 0}
            onChange={(value) => handleInputChange('ppf', value)}
            placeholder="Enter PPF amount"
            helperText="Public Provident Fund contributions"
          />

          {/* EPF */}
          <Input
            label="EPF (Employee Provident Fund)"
            type="currency"
            value={deductions.epf || 0}
            onChange={(value) => handleInputChange('epf', value)}
            placeholder="Enter EPF amount"
            helperText="Employee Provident Fund contributions"
          />

          {/* Life Insurance */}
          <Input
            label="Life Insurance Premium"
            type="currency"
            value={deductions.lifeInsurance || 0}
            onChange={(value) => handleInputChange('lifeInsurance', value)}
            placeholder="Enter life insurance premium"
            helperText="Life insurance premium payments"
          />

          {/* NPS */}
          <Input
            label="NPS (National Pension System)"
            type="currency"
            value={deductions.nps || 0}
            onChange={(value) => handleInputChange('nps', value)}
            placeholder="Enter NPS amount"
            helperText="NPS contributions (additional ₹50,000 limit)"
          />

          {/* Home Loan Principal */}
          <Input
            label="Home Loan Principal"
            type="currency"
            value={deductions.homeLoanPrincipal || 0}
            onChange={(value) => handleInputChange('homeLoanPrincipal', value)}
            placeholder="Enter home loan principal"
            helperText="Home loan principal repayment"
          />

          {/* Sukanya Samriddhi */}
          <Input
            label="Sukanya Samriddhi"
            type="currency"
            value={deductions.sukanyaSamriddhi || 0}
            onChange={(value) => handleInputChange('sukanyaSamriddhi', value)}
            placeholder="Enter Sukanya Samriddhi amount"
            helperText="Sukanya Samriddhi Yojana contributions"
          />

          {/* NSC */}
          <Input
            label="NSC (National Savings Certificate)"
            type="currency"
            value={deductions.nsc || 0}
            onChange={(value) => handleInputChange('nsc', value)}
            placeholder="Enter NSC amount"
            helperText="National Savings Certificate investments"
          />

          {/* Tax Saving FD */}
          <Input
            label="Tax Saving FD"
            type="currency"
            value={deductions.taxSavingFd || 0}
            onChange={(value) => handleInputChange('taxSavingFd', value)}
            placeholder="Enter tax saving FD amount"
            helperText="Tax-saving fixed deposits"
          />
        </div>
        
        {/* 80C Limit Progress */}
        <div className="p-5 bg-gradient-to-r from-green-50/60 via-emerald-50/60 to-green-50/60 rounded-xl border border-green-200/40 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-green-700">80C Limit Utilization</span>
            <span className="text-sm font-medium text-green-700">
              {eightyCLimit.used.toLocaleString('en-IN')}/{eightyCLimit.limit.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-3 mb-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${eightyCLimit.utilizationPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-green-600 opacity-80">
            {eightyCLimit.utilizationPercentage}% used • ₹{eightyCLimit.remaining.toLocaleString('en-IN')} remaining
          </div>
        </div>
      </div>

      {/* 80D Deductions Section */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-3">
          <h4 className="text-lg font-semibold text-gray-800">
            80D Health Insurance Deductions
          </h4>
          <p className="text-sm text-gray-600 mt-1">Health insurance and preventive health checkup expenses</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Health Insurance (Self & Family)"
            type="currency"
            value={deductions.healthInsuranceSelf || 0}
            onChange={(value) => handleInputChange('healthInsuranceSelf', value)}
            placeholder="Enter health insurance premium"
            helperText="Health insurance premium for self and family"
          />

          <Input
            label="Health Insurance (Parents)"
            type="currency"
            value={deductions.healthInsuranceParents || 0}
            onChange={(value) => handleInputChange('healthInsuranceParents', value)}
            placeholder="Enter parents health insurance"
            helperText="Health insurance premium for parents"
          />

          <Input
            label="Preventive Health Checkup"
            type="currency"
            value={deductions.preventiveHealthCheckup || 0}
            onChange={(value) => handleInputChange('preventiveHealthCheckup', value)}
            placeholder="Enter health checkup amount"
            helperText="Preventive health checkup expenses (max ₹5,000)"
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
            type="currency"
            value={deductions.hraExemption || 0}
            onChange={(value) => handleInputChange('hraExemption', value)}
            placeholder="Enter HRA exemption"
            helperText="HRA exemption based on rent paid"
          />

          <Input
            label="LTA (Leave Travel Allowance)"
            type="currency"
            value={deductions.lta || 0}
            onChange={(value) => handleInputChange('lta', value)}
            placeholder="Enter LTA amount"
            helperText="Leave Travel Allowance exemption"
          />

          <Input
            label="Home Loan Interest"
            type="currency"
            value={deductions.homeLoanInterest || 0}
            onChange={(value) => handleInputChange('homeLoanInterest', value)}
            placeholder="Enter home loan interest"
            helperText="Interest on home loan (self-occupied property)"
          />

          <Input
            label="Donations to Charity"
            type="currency"
            value={deductions.donations || 0}
            onChange={(value) => handleInputChange('donations', value)}
            placeholder="Enter donation amount"
            helperText="Donations to eligible charitable institutions"
          />

          <Input
            label="Interest on Savings"
            type="currency"
            value={deductions.interestOnSavings || 0}
            onChange={(value) => handleInputChange('interestOnSavings', value)}
            placeholder="Enter interest on savings"
            helperText="Interest income from savings accounts (80TTA)"
          />
        </div>
      </div>

      {/* Total Deductions Summary */}
      <div className="mt-10 p-6 bg-gradient-to-r from-green-50/60 via-emerald-50/60 to-green-50/60 rounded-xl border border-green-200/40 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-green-800">Total Deductions:</span>
          <span className="text-3xl font-semibold text-green-800">
            {formatCurrency(totalDeductions)}
          </span>
        </div>
        <div className="text-sm text-green-600 mt-2 opacity-80">
          Note: Most deductions are only applicable under Old Tax Regime
        </div>
      </div>
    </Card>
  );
}
