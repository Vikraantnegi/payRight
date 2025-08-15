import { 
  IncomeDetails, 
  DeductionDetails, 
  TaxRegime, 
  TaxCalculation, 
  TaxComparison,
  TaxSlab 
} from '@/types/tax';

// Tax slabs for AY 2026-27 (FY 2025-26) - Updated as per Economic Times
const OLD_REGIME_SLABS: TaxSlab[] = [
  { minIncome: 0, maxIncome: 300000, rate: 0, description: 'No Tax' },
  { minIncome: 300000, maxIncome: 600000, rate: 5, description: '5%' },
  { minIncome: 600000, maxIncome: 900000, rate: 10, description: '10%' },
  { minIncome: 900000, maxIncome: 1200000, rate: 15, description: '15%' },
  { minIncome: 1200000, maxIncome: 1500000, rate: 20, description: '20%' },
  { minIncome: 1500000, maxIncome: Infinity, rate: 30, description: '30%' }
];

// NEW TAX REGIME SLABS for FY 2025-26 (AY 2026-27) - Completely changed as per Economic Times
const NEW_REGIME_SLABS: TaxSlab[] = [
  { minIncome: 0, maxIncome: 400000, rate: 0, description: 'No Tax' },
  { minIncome: 400000, maxIncome: 800000, rate: 5, description: '5%' },
  { minIncome: 800000, maxIncome: 1200000, rate: 10, description: '10%' },
  { minIncome: 1200000, maxIncome: 1600000, rate: 15, description: '15%' },
  { minIncome: 1600000, maxIncome: 2000000, rate: 20, description: '20%' },
  { minIncome: 2000000, maxIncome: 2400000, rate: 25, description: '25%' },
  { minIncome: 2400000, maxIncome: Infinity, rate: 30, description: '30%' }
];

export const OLD_REGIME: TaxRegime = {
  name: 'old',
  description: 'Old Tax Regime with full deductions',
  taxSlabs: OLD_REGIME_SLABS,
  standardDeduction: 50000,
  allowedDeductions: [
    'elss', 'ppf', 'epf', 'lifeInsurance', 'nps', 'homeLoanPrincipal',
    'sukanyaSamriddhi', 'nsc', 'taxSavingFd', 'healthInsuranceSelf',
    'healthInsuranceParents', 'preventiveHealthCheckup', 'hraExemption',
    'lta', 'homeLoanInterest', 'donations', 'interestOnSavings'
  ]
};

export const NEW_REGIME: TaxRegime = {
  name: 'new',
  description: 'New Tax Regime with limited deductions (Updated FY 2025-26)',
  taxSlabs: NEW_REGIME_SLABS,
  standardDeduction: 75000, // Updated to ₹75,000 as per Economic Times
  allowedDeductions: ['standardDeduction'] // Only standard deduction allowed
};

export class TaxCalculator {
  /**
   * Calculate total gross income from all sources
   */
  static calculateGrossIncome(income: IncomeDetails): number {
    return (
      income.basicSalary +
      income.hra +
      income.specialAllowance +
      income.transportAllowance +
      income.medicalAllowance +
      income.performanceBonus +
      income.joiningBonus +
      income.rsus +
      income.otherAllowances
    );
  }

  /**
   * Calculate total deductions for a specific regime
   */
  static calculateTotalDeductions(
    deductions: DeductionDetails, 
    regime: TaxRegime
  ): number {
    let total = 0;
    
    regime.allowedDeductions.forEach(deductionKey => {
      if (deductionKey === 'standardDeduction') {
        total += regime.standardDeduction;
      } else {
        const value = deductions[deductionKey as keyof DeductionDetails];
        if (typeof value === 'number') {
          total += value;
        }
      }
    });

    return total;
  }

  /**
   * Calculate tax amount based on tax slabs
   */
  static calculateTaxAmount(taxableIncome: number, taxSlabs: TaxSlab[]): number {
    let taxAmount = 0;
    let remainingIncome = taxableIncome;

    for (const slab of taxSlabs) {
      if (remainingIncome <= 0) break;

      const slabIncome = Math.min(
        remainingIncome,
        slab.maxIncome === Infinity ? remainingIncome : slab.maxIncome - slab.minIncome
      );

      if (slabIncome > 0) {
        taxAmount += (slabIncome * slab.rate) / 100;
        remainingIncome -= slabIncome;
      }
    }

    return Math.round(taxAmount);
  }

  /**
   * Calculate tax for a specific regime
   */
  static calculateTaxForRegime(
    income: IncomeDetails,
    deductions: DeductionDetails,
    regime: TaxRegime
  ): TaxCalculation {
    const grossIncome = this.calculateGrossIncome(income);
    const totalDeductions = this.calculateTotalDeductions(deductions, regime);
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);
    const taxAmount = this.calculateTaxAmount(taxableIncome, regime.taxSlabs);
    const effectiveTaxRate = grossIncome > 0 ? (taxAmount / grossIncome) * 100 : 0;
    
    const yearlyInHand = grossIncome - taxAmount;
    const monthlyInHand = yearlyInHand / 12;

    return {
      regime,
      grossIncome,
      totalDeductions,
      taxableIncome,
      taxAmount,
      effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
      monthlyInHand: Math.round(monthlyInHand),
      yearlyInHand: Math.round(yearlyInHand),
      standardDeduction: regime.standardDeduction
    };
  }

  /**
   * Compare both tax regimes and provide recommendations
   */
  static compareTaxRegimes(
    income: IncomeDetails,
    deductions: DeductionDetails
  ): TaxComparison {
    const oldRegimeCalc = this.calculateTaxForRegime(income, deductions, OLD_REGIME);
    const newRegimeCalc = this.calculateTaxForRegime(income, deductions, NEW_REGIME);

    const taxSavings = Math.abs(oldRegimeCalc.taxAmount - newRegimeCalc.taxAmount);
    const monthlyDifference = Math.abs(oldRegimeCalc.monthlyInHand - newRegimeCalc.monthlyInHand);
    const yearlyDifference = Math.abs(oldRegimeCalc.yearlyInHand - newRegimeCalc.yearlyInHand);

    const recommendedRegime = oldRegimeCalc.taxAmount <= newRegimeCalc.taxAmount ? 'old' : 'new';
    
    // Generate recommendation text
    let recommendation = '';
    if (recommendedRegime === 'old') {
      recommendation = `The Old Tax Regime is better for you! You'll save ₹${taxSavings.toLocaleString('en-IN')} annually by choosing the Old Tax Regime. This is because your deductions (₹${oldRegimeCalc.totalDeductions.toLocaleString('en-IN')}) provide significant tax benefits that outweigh the higher tax rates.`;
    } else {
      recommendation = `The New Tax Regime is better for you! You'll save ₹${taxSavings.toLocaleString('en-IN')} annually by choosing the New Tax Regime. The lower tax rates provide more benefits than the deductions you could claim under the Old Tax Regime.`;
    }

    return {
      oldRegime: oldRegimeCalc,
      newRegime: newRegimeCalc,
      recommendedRegime,
      recommendation,
      taxSavings,
      monthlyDifference: Math.round(monthlyDifference),
      yearlyDifference: Math.round(yearlyDifference)
    };
  }

  /**
   * Get tax slab information for display
   */
  static getTaxSlabs(regime: TaxRegime): TaxSlab[] {
    return regime.taxSlabs;
  }

  /**
   * Calculate 80C limit utilization
   */
  static calculate80CLimitUtilization(deductions: DeductionDetails): {
    used: number;
    limit: number;
    remaining: number;
    utilizationPercentage: number;
  } {
    const limit = 150000;
    const used = Math.min(
      limit,
      deductions.elss + deductions.ppf + deductions.epf + 
      deductions.lifeInsurance + deductions.nps + deductions.homeLoanPrincipal +
      deductions.sukanyaSamriddhi + deductions.nsc + deductions.taxSavingFd
    );
    
    return {
      used,
      limit,
      remaining: Math.max(0, limit - used),
      utilizationPercentage: Math.round((used / limit) * 100)
    };
  }
}
