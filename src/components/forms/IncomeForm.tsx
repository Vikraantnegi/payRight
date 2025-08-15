'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useTax } from '@/lib/TaxContext';
import {
  CurrencyRupeeIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export function IncomeForm() {
  const { state, updateIncome } = useTax();
  const { income } = state;
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isValid, setIsValid] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const handleInputChange = (field: keyof typeof income, value: number) => {
    updateIncome({ ...income, [field]: value });
    validateField(field, value);
  };

  const validateField = (field: string, value: number) => {
    const errors = { ...validationErrors };

    if (field === 'basicSalary') {
      if (value < 0) {
        errors[field] = 'Basic salary cannot be negative';
      } else if (value === 0) {
        errors[field] = 'Basic salary is required';
      } else if (value > 10000000) {
        errors[field] = 'Basic salary seems unusually high';
      } else {
        delete errors[field];
      }
    }

    if (field === 'hra' && value > income.basicSalary * 0.5) {
      errors[field] = 'HRA cannot exceed 50% of basic salary';
    } else if (field === 'hra') {
      delete errors[field];
    }

    if (field === 'rsus' && value > income.basicSalary * 2) {
      errors[field] = 'RSUs seem unusually high compared to basic salary';
    } else if (field === 'rsus') {
      delete errors[field];
    }

    setValidationErrors(errors);
  };

  const calculateCompletion = () => {
    const requiredFields = ['basicSalary'];
    const optionalFields = [
      'hra',
      'rsus',
      'performanceBonus',
      'specialAllowance',
      'otherAllowances',
    ];

    const requiredComplete = requiredFields.every(
      field => income[field as keyof typeof income] > 0
    );
    const optionalComplete = optionalFields.filter(
      field => income[field as keyof typeof income] > 0
    ).length;

    const percentage = requiredComplete
      ? (optionalComplete / optionalFields.length) * 50 + 50
      : income.basicSalary > 0
        ? 25
        : 0;
    setCompletionPercentage(Math.round(percentage));
  };

  useEffect(() => {
    calculateCompletion();
    setIsValid(
      Object.keys(validationErrors).length === 0 && income.basicSalary > 0
    );
  }, [income, validationErrors]);

  const getTotalIncome = () => {
    return Object.values(income).reduce((sum, value) => sum + (value || 0), 0);
  };

  const getIncomeBreakdown = () => {
    const breakdown = [];
    if (income.basicSalary > 0)
      breakdown.push({
        label: 'Basic Salary',
        value: income.basicSalary,
        percentage: (income.basicSalary / getTotalIncome()) * 100,
      });
    if (income.hra > 0)
      breakdown.push({
        label: 'HRA',
        value: income.hra,
        percentage: (income.hra / getTotalIncome()) * 100,
      });
    if (income.rsus > 0)
      breakdown.push({
        label: 'RSUs',
        value: income.rsus,
        percentage: (income.rsus / getTotalIncome()) * 100,
      });
    if (income.performanceBonus > 0)
      breakdown.push({
        label: 'Performance Bonus',
        value: income.performanceBonus,
        percentage: (income.performanceBonus / getTotalIncome()) * 100,
      });
    if (income.specialAllowance > 0)
      breakdown.push({
        label: 'Special Allowance',
        value: income.specialAllowance,
        percentage: (income.specialAllowance / getTotalIncome()) * 100,
      });
    if (income.otherAllowances > 0)
      breakdown.push({
        label: 'Other Allowances',
        value: income.otherAllowances,
        percentage: (income.otherAllowances / getTotalIncome()) * 100,
      });
    return breakdown;
  };

  return (
    <Card
      title='Income Details'
      subtitle='Enter your annual income from all sources'
      className='space-y-8'
    >
      {/* Progress Indicator */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-gray-700'>
            Form Completion
          </span>
          <span className='text-sm font-medium text-gray-500'>
            {completionPercentage}%
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out'
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className='flex items-center space-x-2 text-xs text-gray-500'>
          <CheckCircleIcon className='h-4 w-4 text-green-500' />
          <span>
            {completionPercentage >= 100
              ? 'Complete! Ready to proceed'
              : 'Fill in required fields to continue'}
          </span>
        </div>
      </div>

      {/* Income Inputs */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <Input
          label='Basic Salary *'
          type='currency'
          value={income.basicSalary || 0}
          onChange={value => handleInputChange('basicSalary', value)}
          placeholder='Enter basic salary'
          helperText='Your base salary before any allowances'
          required
          error={validationErrors.basicSalary}
          className={validationErrors.basicSalary ? 'ring-2 ring-red-200' : ''}
        />

        <Input
          label='HRA (House Rent Allowance)'
          type='currency'
          value={income.hra || 0}
          onChange={value => handleInputChange('hra', value)}
          placeholder='Enter HRA amount'
          helperText='Usually 40-50% of basic salary in metro cities'
          error={validationErrors.hra}
          className={validationErrors.hra ? 'ring-2 ring-red-200' : ''}
        />

        <Input
          label='RSUs/ESOPs'
          type='currency'
          value={income.rsus || 0}
          onChange={value => handleInputChange('rsus', value)}
          placeholder='Enter RSU value'
          helperText='Annual value of stock grants'
          error={validationErrors.rsus}
          className={validationErrors.rsus ? 'ring-2 ring-red-200' : ''}
        />

        <Input
          label='Performance Bonus'
          type='currency'
          value={income.performanceBonus || 0}
          onChange={value => handleInputChange('performanceBonus', value)}
          placeholder='Enter bonus amount'
          helperText='Annual performance bonus'
        />

        <Input
          label='Other Allowances'
          type='currency'
          value={income.specialAllowance || 0}
          onChange={value => handleInputChange('specialAllowance', value)}
          placeholder='Enter allowances'
          helperText='Transport, meal, etc.'
        />

        <Input
          label='Other Income'
          type='currency'
          value={income.otherAllowances || 0}
          onChange={value => handleInputChange('otherAllowances', value)}
          placeholder='Enter other income'
          helperText='Interest, rental, etc.'
        />
      </div>

      {/* Income Summary */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/40'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            Income Summary
          </h3>
          <div className='flex items-center space-x-2'>
            <CurrencyRupeeIcon className='h-5 w-5 text-blue-500' />
            <span className='text-sm text-gray-600'>Annual Total</span>
          </div>
        </div>

        <div className='text-center mb-6'>
          <div className='text-3xl font-bold text-gray-800'>
            ₹{getTotalIncome().toLocaleString('en-IN')}
          </div>
          <div className='text-sm text-gray-500'>Total Annual Income</div>
        </div>

        {/* Income Breakdown */}
        {getIncomeBreakdown().length > 0 && (
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-gray-700 text-center mb-3'>
              Income Breakdown
            </h4>
            {getIncomeBreakdown().map((item, index) => (
              <div
                key={index}
                className='flex items-center justify-between text-sm'
              >
                <span className='text-gray-600'>{item.label}</span>
                <div className='flex items-center space-x-3'>
                  <div className='w-24 bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-500 h-2 rounded-full transition-all duration-500'
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className='text-gray-800 font-medium w-20 text-right'>
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
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center space-x-2 mb-2'>
            <ExclamationTriangleIcon className='h-5 w-5 text-red-500' />
            <span className='font-medium text-red-800'>
              Please fix the following issues:
            </span>
          </div>
          <ul className='list-disc list-inside space-y-1 text-sm text-red-700'>
            {Object.entries(validationErrors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Helpful Tips */}
      <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
        <div className='flex items-start space-x-3'>
          <InformationCircleIcon className='h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0' />
          <div className='text-sm text-amber-800'>
            <div className='font-medium mb-1'>💡 Pro Tips:</div>
            <ul className='space-y-1 text-xs'>
              <li>
                • Basic salary is required and should be your core compensation
              </li>
              <li>• HRA is typically 40-50% of basic salary in metro cities</li>
              <li>
                • Include the annual value of RSUs/ESOPs for accurate
                calculations
              </li>
              <li>• Performance bonuses vary by company and role</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
