// Utility functions for formatting and display

/**
 * Format number as Indian currency (with commas and ₹ symbol)
 */
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return '₹0';
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};

/**
 * Format number as Indian currency without symbol (just commas)
 */
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-IN').format(amount);
};

/**
 * Format percentage with 2 decimal places
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Format large numbers with K, L, Cr suffixes
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + ' Cr';
  } else if (num >= 100000) {
    return (num / 100000).toFixed(1) + ' L';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + ' K';
  }
  return num.toString();
};

/**
 * Format monthly salary (divide by 12 and format)
 */
export const formatMonthlySalary = (yearlyAmount: number): string => {
  const monthly = yearlyAmount / 12;
  return formatCurrency(monthly);
};

/**
 * Get color class based on tax regime recommendation
 */
export const getRegimeColor = (regime: 'old' | 'new'): string => {
  return regime === 'old' ? 'text-green-600' : 'text-blue-600';
};

/**
 * Get background color class based on tax regime recommendation
 */
export const getRegimeBgColor = (regime: 'old' | 'new'): string => {
  return regime === 'old' ? 'bg-green-50' : 'bg-blue-50';
};

/**
 * Format tax slab description
 */
export const formatTaxSlab = (slab: { minIncome: number; maxIncome: number; rate: number }): string => {
  const min = formatCurrency(slab.minIncome);
  const max = slab.maxIncome === Infinity ? '∞' : formatCurrency(slab.maxIncome);
  return `${min} - ${max} @ ${slab.rate}%`;
};
