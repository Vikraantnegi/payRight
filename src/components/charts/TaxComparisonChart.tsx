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
  Legend,
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface TaxComparisonChartProps {
  oldRegime: {
    taxAmount: number;
    taxableIncome: number;
    totalDeductions: number;
    effectiveTaxRate: number;
  };
  newRegime: {
    taxAmount: number;
    taxableIncome: number;
    totalDeductions: number;
    effectiveTaxRate: number;
  };
}

export function TaxComparisonChart({
  oldRegime,
  newRegime,
}: TaxComparisonChartProps) {
  const data = [
    {
      name: 'Tax Amount',
      'Old Regime': oldRegime.taxAmount,
      'New Regime': newRegime.taxAmount,
    },
    {
      name: 'Taxable Income',
      'Old Regime': oldRegime.taxableIncome,
      'New Regime': newRegime.taxableIncome,
    },
    {
      name: 'Total Deductions',
      'Old Regime': oldRegime.totalDeductions,
      'New Regime': newRegime.totalDeductions,
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
      <h3 className='text-lg font-semibold text-gray-800 mb-4 text-center'>
        Tax Regime Comparison
      </h3>
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
          <Legend
            verticalAlign='top'
            height={36}
            wrapperStyle={{ paddingBottom: '10px' }}
          />
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
    </div>
  );
}
