'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useTax } from '@/lib/TaxContext';
import { 
  ShieldCheckIcon, 
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

export function DeductionsForm() {
  const { state, updateDeductions } = useTax();
  const { deductions } = state;
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [total80C, setTotal80C] = useState(0);

  const handleInputChange = (field: keyof typeof deductions, value: number) => {
    updateDeductions({ ...deductions, [field]: value });
    validateField(field, value);
  };

  const validateField = (field: string, value: number) => {
    const errors = { ...validationErrors };
    
    // 80C validation (limit: ₹1.5L)
    if (['elss', 'ppf', 'epf', 'lifeInsurance', 'nps', 'homeLoanPrincipal', 'sukanyaSamriddhi', 'nsc', 'taxSavingFd'].includes(field)) {
      const current80C = calculateTotal80C();
      if (current80C > 150000) {
        errors[field] = `Total 80C deductions exceed ₹1.5L limit (Current: ₹${current80C.toLocaleString('en-IN')})`;
      } else {
        delete errors[field];
      }
    }

    // 80D validation (limit: ₹25K for self, ₹50K for parents)
    if (field === 'healthInsuranceParents' && value > 50000) {
      errors[field] = 'Health insurance for parents cannot exceed ₹50,000';
    } else if (field === 'healthInsuranceParents') {
      delete errors[field];
    }

    if (field === 'healthInsuranceSelf' && value > 25000) {
      errors[field] = 'Health insurance for self cannot exceed ₹25,000';
    } else if (field === 'healthInsuranceSelf') {
      delete errors[field];
    }

    setValidationErrors(errors);
  };

  const calculateTotal80C = () => {
    const eightyCFields = ['elss', 'ppf', 'epf', 'lifeInsurance', 'nps', 'homeLoanPrincipal', 'sukanyaSamriddhi', 'nsc', 'taxSavingFd'];
    return eightyCFields.reduce((sum, field) => sum + (deductions[field as keyof typeof deductions] || 0), 0);
  };

  const calculateCompletion = () => {
    const totalFields = Object.keys(deductions).length;
    const filledFields = Object.values(deductions).filter(value => value > 0).length;
    const percentage = Math.round((filledFields / totalFields) * 100);
    setCompletionPercentage(percentage);
  };

  useEffect(() => {
    calculateCompletion();
    setTotal80C(calculateTotal80C());
  }, [deductions]);

  const getTotalDeductions = () => {
    return Object.values(deductions).reduce((sum, value) => sum + (value || 0), 0);
  };

  const getDeductionsBreakdown = () => {
    const breakdown: Array<{ label: string; value: number; percentage: number }> = [];
    const categories = [
      { label: '80C Investments', fields: ['elss', 'ppf', 'epf', 'lifeInsurance', 'nps', 'homeLoanPrincipal', 'sukanyaSamriddhi', 'nsc', 'taxSavingFd'] },
      { label: '80D Health', fields: ['healthInsuranceSelf', 'healthInsuranceParents', 'preventiveHealthCheckup'] },
      { label: 'Other Deductions', fields: ['hraExemption', 'lta', 'homeLoanInterest', 'donations', 'interestOnSavings'] }
    ];

    categories.forEach(category => {
      const categoryTotal = category.fields.reduce((sum, field) => sum + (deductions[field as keyof typeof deductions] || 0), 0);
      if (categoryTotal > 0) {
        breakdown.push({
          label: category.label,
          value: categoryTotal,
          percentage: (categoryTotal / getTotalDeductions()) * 100
        });
      }
    });

    return breakdown;
  };

  return (
    <Card title="Deductions & Exemptions" subtitle="Enter your tax-saving investments and exemptions (Old Tax Regime only)" className="space-y-8">
      {/* Progress Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Form Completion</span>
          <span className="text-sm font-medium text-gray-500">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
          <span>{completionPercentage >= 100 ? 'Complete! Ready to calculate' : 'Fill in deductions to maximize tax savings'}</span>
        </div>
      </div>

      {/* 80C Investments Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">80C Investments (Limit: ₹1.5L)</h3>
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">
              Used: ₹{total80C.toLocaleString('en-IN')} / ₹1,50,000
            </span>
          </div>
        </div>
        
        {/* 80C Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              total80C >= 150000 ? 'bg-green-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'
            }`}
            style={{ width: `${Math.min((total80C / 150000) * 100, 100)}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Input
            label="ELSS (Equity Linked Savings Scheme)"
            type="currency"
            value={deductions.elss || 0}
            onChange={(value) => handleInputChange('elss', value)}
            placeholder="Enter ELSS amount"
            helperText="Tax-saving mutual funds"
            error={validationErrors.elss}
            className={validationErrors.elss ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="PPF (Public Provident Fund)"
            type="currency"
            value={deductions.ppf || 0}
            onChange={(value) => handleInputChange('ppf', value)}
            placeholder="Enter PPF amount"
            helperText="Government-backed savings scheme"
            error={validationErrors.ppf}
            className={validationErrors.ppf ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="EPF (Employee Provident Fund)"
            type="currency"
            value={deductions.epf || 0}
            onChange={(value) => handleInputChange('epf', value)}
            placeholder="Enter EPF amount"
            helperText="Employer contribution to EPF"
            error={validationErrors.epf}
            className={validationErrors.epf ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="Life Insurance Premium"
            type="currency"
            value={deductions.lifeInsurance || 0}
            onChange={(value) => handleInputChange('lifeInsurance', value)}
            placeholder="Enter premium amount"
            helperText="Life insurance policy premiums"
            error={validationErrors.lifeInsurance}
            className={validationErrors.lifeInsurance ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="NPS (National Pension System)"
            type="currency"
            value={deductions.nps || 0}
            onChange={(value) => handleInputChange('nps', value)}
            placeholder="Enter NPS amount"
            helperText="Additional ₹50K deduction available"
            error={validationErrors.nps}
            className={validationErrors.nps ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="Home Loan Principal"
            type="currency"
            value={deductions.homeLoanPrincipal || 0}
            onChange={(value) => handleInputChange('homeLoanPrincipal', value)}
            placeholder="Enter principal amount"
            helperText="Home loan principal repayment"
            error={validationErrors.homeLoanPrincipal}
            className={validationErrors.homeLoanPrincipal ? 'ring-2 ring-red-200' : ''}
          />

          <Input
            label="Sukanya Samriddhi"
            type="currency"
            value={deductions.sukanyaSamriddhi || 0}
            onChange={(value) => handleInputChange('sukanyaSamriddhi', value)}
            placeholder="Enter amount"
            helperText="Girl child savings scheme"
            error={validationErrors.sukanyaSamriddhi}
            className={validationErrors.sukanyaSamriddhi ? 'ring-2 ring-red-200' : ''}
          />

          <Input
            label="NSC (National Savings Certificate)"
            type="currency"
            value={deductions.nsc || 0}
            onChange={(value) => handleInputChange('nsc', value)}
            placeholder="Enter amount"
            helperText="Government savings certificate"
            error={validationErrors.nsc}
            className={validationErrors.nsc ? 'ring-2 ring-red-200' : ''}
          />

          <Input
            label="Tax Saving FD"
            type="currency"
            value={deductions.taxSavingFd || 0}
            onChange={(value) => handleInputChange('taxSavingFd', value)}
            placeholder="Enter amount"
            helperText="Tax-saving fixed deposits"
            error={validationErrors.taxSavingFd}
            className={validationErrors.taxSavingFd ? 'ring-2 ring-red-200' : ''}
          />
        </div>
      </div>

      {/* 80D Health Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">80D Health Insurance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Input
            label="Health Insurance (Self)"
            type="currency"
            value={deductions.healthInsuranceSelf || 0}
            onChange={(value) => handleInputChange('healthInsuranceSelf', value)}
            placeholder="Enter premium amount"
            helperText="Limit: ₹25,000"
            error={validationErrors.healthInsuranceSelf}
            className={validationErrors.healthInsuranceSelf ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="Health Insurance (Parents)"
            type="currency"
            value={deductions.healthInsuranceParents || 0}
            onChange={(value) => handleInputChange('healthInsuranceParents', value)}
            placeholder="Enter premium amount"
            helperText="Limit: ₹50,000"
            error={validationErrors.healthInsuranceParents}
            className={validationErrors.healthInsuranceParents ? 'ring-2 ring-red-200' : ''}
          />
          
          <Input
            label="Preventive Health Checkup"
            type="currency"
            value={deductions.preventiveHealthCheckup || 0}
            onChange={(value) => handleInputChange('preventiveHealthCheckup', value)}
            placeholder="Enter amount"
            helperText="Up to ₹5,000 annually"
          />
        </div>
      </div>

      {/* Other Deductions Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Other Deductions & Exemptions</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Input
            label="HRA Exemption"
            type="currency"
            value={deductions.hraExemption || 0}
            onChange={(value) => handleInputChange('hraExemption', value)}
            placeholder="Enter HRA exemption"
            helperText="Based on actual rent paid"
          />
          
          <Input
            label="LTA (Leave Travel Allowance)"
            type="currency"
            value={deductions.lta || 0}
            onChange={(value) => handleInputChange('lta', value)}
            placeholder="Enter LTA amount"
            helperText="Travel expenses for family"
          />
          
          <Input
            label="Home Loan Interest"
            type="currency"
            value={deductions.homeLoanInterest || 0}
            onChange={(value) => handleInputChange('homeLoanInterest', value)}
            placeholder="Enter interest amount"
            helperText="Up to ₹2L annually"
          />
          
          <Input
            label="Donations (80G)"
            type="currency"
            value={deductions.donations || 0}
            onChange={(value) => handleInputChange('donations', value)}
            placeholder="Enter donation amount"
            helperText="Charitable donations"
          />

          <Input
            label="Interest on Savings"
            type="currency"
            value={deductions.interestOnSavings || 0}
            onChange={(value) => handleInputChange('interestOnSavings', value)}
            placeholder="Enter amount"
            helperText="Interest income from savings (80TTA)"
          />
        </div>
      </div>

      {/* Deductions Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Deductions Summary</h3>
          <div className="flex items-center space-x-2">
            <CurrencyRupeeIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600">Total Deductions</span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-800">
            ₹{getTotalDeductions().toLocaleString('en-IN')}
          </div>
          <div className="text-sm text-gray-500">Total Annual Deductions</div>
        </div>

        {/* Deductions Breakdown */}
        {getDeductionsBreakdown().length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 text-center mb-3">Deductions Breakdown</h4>
            {getDeductionsBreakdown().map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-800 font-medium w-20 text-right">
                    ₹{item.value.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Validation Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-800">Please fix the following issues:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
            {Object.entries(validationErrors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Helpful Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <div className="font-medium mb-1">💡 Tax-Saving Tips:</div>
            <ul className="space-y-1 text-xs">
              <li>• 80C limit is ₹1.5L - prioritize high-return options like ELSS</li>
              <li>• NPS offers additional ₹50K deduction beyond 80C</li>
              <li>• Health insurance premiums are fully deductible under 80D</li>
              <li>• HRA exemption depends on actual rent paid and city type</li>
              <li>• Home loan interest up to ₹2L is deductible</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
