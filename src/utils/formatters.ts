// Utility functions for formatting and display

/**
 * Format number as Indian currency (with commas and ₹ symbol)
 */
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Format number as Indian currency without symbol (just commas)
 */
export const formatNumber = (amount: number): string => {
  if (amount === 0) return '0';
  return amount.toLocaleString('en-IN');
};

/**
 * Format percentage with 2 decimal places
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format large numbers with K, L, Cr suffixes
 */
export const formatLargeNumber = (amount: number): string => {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)} K`;
  }
  return amount.toString();
};

/**
 * Format monthly salary (divide by 12 and format)
 */
export const formatMonthlySalary = (annualAmount: number): string => {
  const monthly = annualAmount / 12;
  return formatCurrency(monthly);
};

/**
 * Get color class based on tax regime recommendation
 */
export const getRegimeColor = (regime: 'old' | 'new'): string => {
  return regime === 'old' ? 'text-blue-600' : 'text-green-600';
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
export const formatTaxSlabDescription = (slab: { minIncome: number; maxIncome: number; rate: number }): string => {
  if (slab.maxIncome === Infinity) {
    return `Above ₹${formatLargeNumber(slab.minIncome)}`;
  }
  return `₹${formatLargeNumber(slab.minIncome)} - ₹${formatLargeNumber(slab.maxIncome)}`;
};
