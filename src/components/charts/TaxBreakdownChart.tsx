'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface TaxBreakdownChartProps {
  regime: 'old' | 'new';
  taxAmount: number;
  taxableIncome: number;
  effectiveTaxRate: number;
}

export function TaxBreakdownChart({ regime, taxAmount, taxableIncome, effectiveTaxRate }: TaxBreakdownChartProps) {
  const regimeName = regime === 'old' ? 'Old Tax Regime' : 'New Tax Regime';
  const regimeColor = regime === 'old' ? '#10b981' : '#3b82f6';
  
  // Calculate tax-free income (income below taxable threshold)
  const taxFreeIncome = taxableIncome - (taxAmount / (effectiveTaxRate / 100));
  
  const data = [
    {
      name: 'Tax Amount',
      value: taxAmount,
      color: regimeColor,
    },
    {
      name: 'Tax-Free Income',
      value: Math.max(0, taxFreeIncome),
      color: '#e5e7eb',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm" style={{ color: data.color }}>
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-gray-500">
            {formatPercentage((data.value / taxableIncome) * 100)} of taxable income
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {regimeName} Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => (
              <span className="text-sm text-gray-700">
                {value}: {formatCurrency(entry.payload.value)}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-center space-y-2">
        <div className="text-2xl font-bold text-gray-800">
          {formatCurrency(taxAmount)}
        </div>
        <div className="text-sm text-gray-600">
          Effective Tax Rate: {formatPercentage(effectiveTaxRate)}
        </div>
      </div>
    </div>
  );
}
