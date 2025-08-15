'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { TaxComparison } from '@/types/tax';
import { formatCurrency, formatPercentage, getRegimeColor } from '@/utils/formatters';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface TaxResultsProps {
  comparison: TaxComparison;
  onReset: () => void;
}

export function TaxResults({ comparison, onReset }: TaxResultsProps) {
  const { oldRegime, newRegime, recommendation } = comparison;
  const savings = Math.abs(oldRegime.taxAmount - newRegime.taxAmount);
  const isOldRegimeBetter = oldRegime.taxAmount < newRegime.taxAmount;

  return (
    <div className="space-y-8">
      {/* Header Results */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-3">
          <CheckCircleIcon className="h-8 w-8 text-green-500" />
          <h2 className="text-3xl font-semibold text-gray-800">
            Tax Calculation Complete! 🎉
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Here&apos;s your detailed tax breakdown and regime comparison for AY 2026-27
        </p>
      </div>

      {/* Regime Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Old Tax Regime Card */}
        <Card 
          title="Old Tax Regime" 
          subtitle="Full deductions with higher tax rates"
          className={`border-2 ${isOldRegimeBetter ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}
        >
          <div className="space-y-6">
            {/* Tax Amount */}
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-2xl font-medium text-gray-600 mb-2">Total Tax</div>
              <div className="text-4xl font-bold text-gray-800">
                {formatCurrency(oldRegime.taxAmount)}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Monthly: {formatCurrency(oldRegime.taxAmount / 12)}
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Gross Income:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(oldRegime.grossIncome)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Total Deductions:</span>
                <span className="font-semibold text-green-600">-{formatCurrency(oldRegime.totalDeductions)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Taxable Income:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(oldRegime.taxableIncome)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Standard Deduction:</span>
                <span className="font-semibold text-green-600">-{formatCurrency(oldRegime.standardDeduction)}</span>
              </div>
              <div className="flex justify-between items-center py-2 font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                <span>Final Tax:</span>
                <span className="text-lg">{formatCurrency(oldRegime.taxAmount)}</span>
              </div>
            </div>

            {/* Effective Tax Rate */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Effective Tax Rate</div>
              <div className="text-2xl font-bold text-gray-800">
                {formatPercentage(oldRegime.effectiveTaxRate)}
              </div>
            </div>
          </div>
        </Card>

        {/* New Tax Regime Card */}
        <Card 
          title="New Tax Regime" 
          subtitle="Lower rates with limited deductions"
          className={`border-2 ${!isOldRegimeBetter ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}
        >
          <div className="space-y-6">
            {/* Tax Amount */}
            <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-2xl font-medium text-gray-600 mb-2">Total Tax</div>
              <div className="text-4xl font-bold text-gray-800">
                {formatCurrency(newRegime.taxAmount)}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Monthly: {formatCurrency(newRegime.taxAmount / 12)}
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Gross Income:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(newRegime.grossIncome)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Total Deductions:</span>
                <span className="font-semibold text-green-600">-{formatCurrency(newRegime.totalDeductions)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Taxable Income:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(newRegime.taxableIncome)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700 font-medium">Standard Deduction:</span>
                <span className="font-semibold text-green-600">-{formatCurrency(newRegime.standardDeduction)}</span>
              </div>
              <div className="flex justify-between items-center py-2 font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                <span>Final Tax:</span>
                <span className="text-lg">{formatCurrency(newRegime.taxAmount)}</span>
              </div>
            </div>

            {/* Effective Tax Rate */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Effective Tax Rate</div>
              <div className="text-2xl font-bold text-gray-800">
                {formatPercentage(newRegime.effectiveTaxRate)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recommendation & Savings */}
      <Card 
        title="💡 Recommendation" 
        subtitle="Based on your income and deductions"
        className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border-blue-200/40"
      >
        <div className="text-center space-y-6">
          {/* Recommendation */}
          <div className="p-6 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {isOldRegimeBetter ? (
                <ArrowTrendingDownIcon className="h-8 w-8 text-green-500" />
              ) : (
                <ArrowTrendingUpIcon className="h-8 w-8 text-blue-500" />
              )}
              <h3 className="text-2xl font-semibold text-gray-800">
                Choose {isOldRegimeBetter ? 'Old Tax Regime' : 'New Tax Regime'}
              </h3>
            </div>
            <p className="text-lg text-gray-600 mb-4">
              {recommendation}
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <CheckCircleIcon className="h-4 w-4" />
              <span>Recommended Choice</span>
            </div>
          </div>

          {/* Tax Savings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-600 mb-2">Tax Savings</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(savings)}
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-600 mb-2">Monthly Savings</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(savings / 12)}
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-600 mb-2">Savings %</div>
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage((savings / Math.max(oldRegime.taxAmount, newRegime.taxAmount)) * 100)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={onReset}
          className="px-8 py-4 rounded-lg font-medium text-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
        >
          <ArrowRightIcon className="h-4 w-4" />
          <span>Calculate Again</span>
        </button>
      </div>
    </div>
  );
}
