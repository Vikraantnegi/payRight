'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface SavingsChartProps {
  oldRegime: {
    taxAmount: number;
    monthlyInHand: number;
    yearlyInHand: number;
  };
  newRegime: {
    taxAmount: number;
    monthlyInHand: number;
    yearlyInHand: number;
  };
}

export function SavingsChart({ oldRegime, newRegime }: SavingsChartProps) {
  const taxSavings = Math.abs(oldRegime.taxAmount - newRegime.taxAmount);
  const monthlySavings = Math.abs(
    oldRegime.monthlyInHand - newRegime.monthlyInHand
  );
  const yearlySavings = Math.abs(
    oldRegime.yearlyInHand - newRegime.yearlyInHand
  );

  const isOldRegimeBetter = oldRegime.taxAmount < newRegime.taxAmount;

  const data = [
    {
      name: 'Tax Amount',
      'Old Regime': oldRegime.taxAmount,
      'New Regime': newRegime.taxAmount,
    },
    {
      name: 'Monthly In-Hand',
      'Old Regime': oldRegime.monthlyInHand,
      'New Regime': newRegime.monthlyInHand,
    },
    {
      name: 'Yearly In-Hand',
      'Old Regime': oldRegime.yearlyInHand,
      'New Regime': newRegime.yearlyInHand,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
          <p className='font-semibold text-gray-800'>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className='text-sm'>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
      <div className='text-center mb-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
          Tax Savings Analysis
        </h3>
        <div
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            isOldRegimeBetter
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <span>
            {isOldRegimeBetter ? 'Old Regime' : 'New Regime'} is Better
          </span>
        </div>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
          <XAxis
            dataKey='name'
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={value => formatCurrency(value)}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey='Old Regime'
            fill='#10b981'
            radius={[4, 4, 0, 0]}
            name='Old Tax Regime'
          />
          <Bar
            dataKey='New Regime'
            fill='#3b82f6'
            radius={[4, 4, 0, 0]}
            name='New Tax Regime'
          />
        </BarChart>
      </ResponsiveContainer>

      <div className='mt-6 grid grid-cols-3 gap-4 text-center'>
        <div>
          <div className='text-sm text-gray-600 mb-1'>Tax Savings</div>
          <div className='text-lg font-semibold text-green-600'>
            {formatCurrency(taxSavings)}
          </div>
        </div>
        <div>
          <div className='text-sm text-gray-600 mb-1'>Monthly Savings</div>
          <div className='text-lg font-semibold text-green-600'>
            {formatCurrency(monthlySavings)}
          </div>
        </div>
        <div>
          <div className='text-sm text-gray-600 mb-1'>Yearly Savings</div>
          <div className='text-lg font-semibold text-green-600'>
            {formatCurrency(yearlySavings)}
          </div>
        </div>
      </div>
    </div>
  );
}
