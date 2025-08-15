// Tax calculation types and interfaces

export interface IncomeDetails {
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  transportAllowance: number;
  medicalAllowance: number;
  performanceBonus: number;
  joiningBonus: number;
  rsus: number;
  otherAllowances: number;
}

export interface DeductionDetails {
  // 80C deductions
  elss: number;
  ppf: number;
  epf: number;
  lifeInsurance: number;
  nps: number;
  homeLoanPrincipal: number;
  sukanyaSamriddhi: number;
  nsc: number;
  taxSavingFd: number;
  
  // 80D deductions
  healthInsuranceSelf: number;
  healthInsuranceParents: number;
  preventiveHealthCheckup: number;
  
  // Other deductions
  hraExemption: number;
  lta: number;
  homeLoanInterest: number;
  donations: number;
  interestOnSavings: number;
  standardDeduction: number;
}

export interface TaxRegime {
  name: 'old' | 'new';
  description: string;
  taxSlabs: TaxSlab[];
  standardDeduction: number;
  allowedDeductions: (keyof DeductionDetails)[];
}

export interface TaxSlab {
  minIncome: number;
  maxIncome: number;
  rate: number;
  description: string;
}

export interface TaxCalculation {
  regime: TaxRegime;
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxAmount: number;
  effectiveTaxRate: number;
  monthlyInHand: number;
  yearlyInHand: number;
  standardDeduction: number;
}

export interface TaxComparison {
  oldRegime: TaxCalculation;
  newRegime: TaxCalculation;
  recommendedRegime: 'old' | 'new';
  recommendation: string;
  taxSavings: number;
  monthlyDifference: number;
  yearlyDifference: number;
}

export interface CalculationInputs {
  income: IncomeDetails;
  deductions: DeductionDetails;
  financialYear: string;
  age: number;
  city: 'metro' | 'non-metro';
}
