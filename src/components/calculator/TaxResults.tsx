'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { TaxComparison } from '@/types/tax';
import {
  formatCurrency,
  formatPercentage,
  getRegimeColor,
} from '@/utils/formatters';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { TaxComparisonChart } from '@/components/charts/TaxComparisonChart';
import { TaxBreakdownChart } from '@/components/charts/TaxBreakdownChart';
import { SavingsChart } from '@/components/charts/SavingsChart';

interface TaxResultsProps {
  comparison: TaxComparison;
  onReset: () => void;
}

export function TaxResults({ comparison, onReset }: TaxResultsProps) {
  const { oldRegime, newRegime, recommendation } = comparison;
  const savings = Math.abs(oldRegime.taxAmount - newRegime.taxAmount);
  const isOldRegimeBetter = oldRegime.taxAmount < newRegime.taxAmount;

  return (
    <div className='space-y-8'>
      {/* Header Results */}
      <div className='text-center space-y-6'>
        <div className='flex items-center justify-center space-x-3'>
          <div className='relative'>
            <CheckCircleIcon className='h-8 w-8 text-green-500' />
            <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
            </div>
          </div>
          <h2 className='text-3xl font-semibold text-gray-800'>
            Tax Calculation Complete! 🎉
          </h2>
        </div>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Here&apos;s your detailed tax breakdown and regime comparison for AY
          2026-27
        </p>

        {/* Progress Indicator */}
        <div className='flex items-center justify-center space-x-2'>
          <div className='w-2 h-2 bg-green-500 rounded-full animate-bounce' />
          <div
            className='w-2 h-2 bg-green-500 rounded-full animate-bounce'
            style={{ animationDelay: '0.1s' }}
          />
          <div
            className='w-2 h-2 bg-green-500 rounded-full animate-bounce'
            style={{ animationDelay: '0.2s' }}
          />
        </div>
      </div>

      {/* Regime Comparison Cards */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Old Tax Regime Card */}
        <Card
          title='Old Tax Regime'
          subtitle='Full deductions with higher tax rates'
          className={`border-2 ${isOldRegimeBetter ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}
        >
          <div className='space-y-6'>
            {/* Tax Amount */}
            <div className='text-center p-6 bg-white rounded-xl border border-gray-200'>
              <div className='text-2xl font-medium text-gray-600 mb-2'>
                Total Tax
              </div>
              <div className='text-4xl font-bold text-gray-800'>
                {formatCurrency(oldRegime.taxAmount)}
              </div>
              <div className='text-sm text-gray-500 mt-2'>
                Monthly: {formatCurrency(oldRegime.taxAmount / 12)}
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-sm text-gray-700 font-medium'>
                  Gross Income:
                </span>
                <span className='font-semibold text-gray-900'>
                  {formatCurrency(oldRegime.grossIncome)}
                </span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-sm text-gray-700 font-medium'>
                  Taxable Income:
                </span>
                <span className='font-semibold text-gray-900'>
                  {formatCurrency(oldRegime.taxableIncome)}
                </span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-sm text-gray-700 font-medium'>
                  Standard Deduction:
                </span>
                <span className='font-semibold text-green-600'>
                  -{formatCurrency(oldRegime.standardDeduction)}
                </span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-sm text-gray-700 font-medium'>
                  Total Deductions:
                </span>
                <span className='font-semibold text-green-600'>
                  -{formatCurrency(oldRegime.totalDeductions)}
                </span>
              </div>
              <div className='flex justify-between items-center py-2 font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg'>
                <span>Final Tax:</span>
                <span className='text-lg'>
                  {formatCurrency(oldRegime.taxAmount)}
                </span>
              </div>
            </div>

            {/* Effective Tax Rate */}
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-sm text-gray-600 mb-1'>
                Effective Tax Rate
              </div>
              <div className='text-2xl font-bold text-gray-800'>
                {formatPercentage(oldRegime.effectiveTaxRate)}
              </div>
            </div>
          </div>
        </Card>

        {/* New Tax Regime Card */}
        <Card
          title='New Tax Regime'
          subtitle='Lower rates with limited deductions'
          className={`border-2 ${!isOldRegimeBetter ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}
        >
          <div className='space-y-6'>
            {/* Tax Amount */}
            <div className='text-center p-6 bg-white rounded-xl border border-gray-200'>
              <div className='text-2xl font-medium text-gray-600 mb-2'>
                Total Tax
              </div>
              <div className='text-4xl font-bold text-gray-800'>
                {formatCurrency(newRegime.taxAmount)}
              </div>
              <div className='text-sm text-gray-500 mt-2'>
                Monthly: {formatCurrency(newRegime.taxAmount / 12)}
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-sm text-gray-700 font-medium'>
                  Gross Income:
                </span>
                <span className='font-semibold text-gray-900'>
                  {formatCurrency(newRegime.grossIncome)}
                </span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-sm text-gray-700 font-medium'>
                  Total Deductions:
                </span>
                <span className='font-semibold text-green-600'>
                  -{formatCurrency(newRegime.totalDeductions)}
                </span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-sm text-gray-700 font-medium'>
                  Taxable Income:
                </span>
                <span className='font-semibold text-gray-900'>
                  {formatCurrency(newRegime.taxableIncome)}
                </span>
              </div>
              <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                <span className='text-sm text-gray-700 font-medium'>
                  Standard Deduction:
                </span>
                <span className='font-semibold text-green-600'>
                  -{formatCurrency(newRegime.standardDeduction)}
                </span>
              </div>
              <div className='flex justify-between items-center py-2 font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg'>
                <span>Final Tax:</span>
                <span className='text-lg'>
                  {formatCurrency(newRegime.taxAmount)}
                </span>
              </div>
            </div>

            {/* Effective Tax Rate */}
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-sm text-gray-600 mb-1'>
                Effective Tax Rate
              </div>
              <div className='text-2xl font-bold text-gray-800'>
                {formatPercentage(newRegime.effectiveTaxRate)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className='space-y-8'>
        <div className='text-center space-y-4'>
          <div className='inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200/40'>
            <div className='w-2 h-2 bg-blue-500 rounded-full' />
            <h3 className='text-2xl font-semibold text-gray-800'>
              Visual Insights & Analysis
            </h3>
            <div className='w-2 h-2 bg-indigo-500 rounded-full' />
          </div>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Interactive charts to help you understand the differences between
            tax regimes
          </p>
        </div>

        {/* Tax Comparison Chart */}
        <TaxComparisonChart oldRegime={oldRegime} newRegime={newRegime} />

        {/* Tax Breakdown Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <TaxBreakdownChart
            regime='old'
            taxAmount={oldRegime.taxAmount}
            taxableIncome={oldRegime.taxableIncome}
            effectiveTaxRate={oldRegime.effectiveTaxRate}
          />
          <TaxBreakdownChart
            regime='new'
            taxAmount={newRegime.taxAmount}
            taxableIncome={newRegime.taxableIncome}
            effectiveTaxRate={newRegime.effectiveTaxRate}
          />
        </div>

        {/* Savings Analysis Chart */}
        <SavingsChart oldRegime={oldRegime} newRegime={newRegime} />
      </div>

      {/* Recommendation & Action Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
        {/* Recommendation Card - Takes 2 columns */}
        <div className='lg:col-span-2'>
          <Card
            title='💡 Recommendation'
            subtitle='Based on your income and deductions'
            className='bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border-blue-200/40'
          >
            <div className='text-center space-y-6'>
              {/* Recommendation */}
              <div className='p-6 bg-white rounded-xl border border-gray-200'>
                <div className='flex items-center justify-center space-x-3 mb-4'>
                  {isOldRegimeBetter ? (
                    <ArrowTrendingDownIcon className='h-8 w-8 text-green-500' />
                  ) : (
                    <ArrowTrendingUpIcon className='h-8 w-8 text-blue-500' />
                  )}
                  <h3 className='text-2xl font-semibold text-gray-800'>
                    Choose{' '}
                    {isOldRegimeBetter ? 'Old Tax Regime' : 'New Tax Regime'}
                  </h3>
                </div>
                <p className='text-lg text-gray-600 mb-4'>
                  {isOldRegimeBetter
                    ? `The Old Tax Regime is better for you! You'll save ${formatCurrency(savings)} annually by choosing the Old Tax Regime. This is because your deductions (${formatCurrency(oldRegime.totalDeductions)}) provide significant tax benefits that outweigh the higher tax rates.`
                    : `The New Tax Regime is better for you! You'll save ${formatCurrency(savings)} annually by choosing the New Tax Regime. The lower tax rates provide more benefits than the deductions you could claim under the Old Tax Regime.`}
                </p>
                <div className='inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium'>
                  <CheckCircleIcon className='h-4 w-4' />
                  <span>
                    Choose {isOldRegimeBetter ? 'Old' : 'New'} Tax Regime
                  </span>
                </div>
              </div>

              {/* Tax Savings */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='p-4 bg-white rounded-lg border border-gray-200 text-center'>
                  <div className='text-sm text-gray-600 mb-2'>Tax Savings</div>
                  <div className='text-2xl font-bold text-green-600'>
                    {formatCurrency(savings)}
                  </div>
                </div>
                <div className='p-4 bg-white rounded-lg border border-gray-200 text-center'>
                  <div className='text-sm text-gray-600 mb-2'>
                    Monthly Savings
                  </div>
                  <div className='text-2xl font-bold text-green-600'>
                    {formatCurrency(savings / 12)}
                  </div>
                </div>
                <div className='p-4 bg-white rounded-lg border border-gray-200 text-center'>
                  <div className='text-sm text-gray-600 mb-2'>Savings %</div>
                  <div className='text-2xl font-bold text-green-600'>
                    {formatPercentage(
                      (savings /
                        Math.max(oldRegime.taxAmount, newRegime.taxAmount)) *
                        100
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Section - Takes 1 column, right-aligned */}
        <div className='lg:col-span-1 flex flex-col items-center lg:items-end space-y-6'>
          {/* Quick Summary Card */}
          <Card
            title='📊 Summary'
            subtitle='Key figures at a glance'
            className='w-full bg-gradient-to-r from-gray-50/60 to-slate-50/60 border-gray-200/40'
          >
            <div className='space-y-4'>
              <div className='text-center'>
                <div className='text-sm text-gray-600 mb-1'>Gross Income</div>
                <div className='text-xl font-bold text-gray-800'>
                  {formatCurrency(oldRegime.grossIncome)}
                </div>
              </div>
              <div className='text-center'>
                <div className='text-sm text-gray-600 mb-1'>
                  Total Deductions
                </div>
                <div className='text-xl font-bold text-green-600'>
                  {formatCurrency(oldRegime.totalDeductions)}
                </div>
              </div>
              <div className='text-center'>
                <div className='text-sm text-gray-600 mb-1'>
                  Effective Tax Rate
                </div>
                <div className='text-xl font-bold text-blue-600'>
                  {formatPercentage(oldRegime.effectiveTaxRate)}
                </div>
              </div>
            </div>
          </Card>

          {/* Calculate Again Button */}
          <div className='w-full'>
            <button
              onClick={onReset}
              className='w-full px-8 py-4 rounded-xl font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md hover:scale-105 transform'
            >
              <ArrowRightIcon className='h-5 w-5' />
              <span>Calculate Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
