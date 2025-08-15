'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { IncomeDetails, DeductionDetails, TaxComparison } from '@/types/tax';
import { TaxCalculator } from './taxCalculator';

interface TaxState {
  income: IncomeDetails;
  deductions: DeductionDetails;
  comparison: TaxComparison | null;
  isLoading: boolean;
  error: string | null;
}

type TaxAction =
  | { type: 'UPDATE_INCOME'; payload: Partial<IncomeDetails> }
  | { type: 'UPDATE_DEDUCTIONS'; payload: Partial<DeductionDetails> }
  | { type: 'CALCULATE_TAX' }
  | { type: 'CALCULATE_TAX_SUCCESS'; payload: TaxComparison }
  | { type: 'CALCULATE_TAX_ERROR'; payload: string }
  | { type: 'RESET_CALCULATOR' };

const initialState: TaxState = {
  income: {
    basicSalary: 0,
    hra: 0,
    specialAllowance: 0,
    transportAllowance: 0,
    medicalAllowance: 0,
    performanceBonus: 0,
    joiningBonus: 0,
    rsus: 0,
    otherAllowances: 0,
  },
  deductions: {
    elss: 0,
    ppf: 0,
    epf: 0,
    lifeInsurance: 0,
    nps: 0,
    homeLoanPrincipal: 0,
    sukanyaSamriddhi: 0,
    nsc: 0,
    taxSavingFd: 0,
    healthInsuranceSelf: 0,
    healthInsuranceParents: 0,
    preventiveHealthCheckup: 0,
    hraExemption: 0,
    lta: 0,
    homeLoanInterest: 0,
    donations: 0,
    interestOnSavings: 0,
    standardDeduction: 0,
  },
  comparison: null,
  isLoading: false,
  error: null,
};

function taxReducer(state: TaxState, action: TaxAction): TaxState {
  switch (action.type) {
    case 'UPDATE_INCOME':
      return {
        ...state,
        income: { ...state.income, ...action.payload },
      };
    case 'UPDATE_DEDUCTIONS':
      return {
        ...state,
        deductions: { ...state.deductions, ...action.payload },
      };
    case 'CALCULATE_TAX':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'CALCULATE_TAX_SUCCESS':
      return {
        ...state,
        comparison: action.payload,
        isLoading: false,
        error: null,
      };
    case 'CALCULATE_TAX_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'RESET_CALCULATOR':
      return initialState;
    default:
      return state;
  }
}

interface TaxContextType {
  state: TaxState;
  updateIncome: (updates: Partial<IncomeDetails>) => void;
  updateDeductions: (updates: Partial<DeductionDetails>) => void;
  calculateTax: () => void;
  resetCalculator: () => void;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

export function TaxProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taxReducer, initialState);

  const updateIncome = (updates: Partial<IncomeDetails>) => {
    dispatch({ type: 'UPDATE_INCOME', payload: updates });
  };

  const updateDeductions = (updates: Partial<DeductionDetails>) => {
    dispatch({ type: 'UPDATE_DEDUCTIONS', payload: updates });
  };

  const calculateTax = () => {
    dispatch({ type: 'CALCULATE_TAX' });

    try {
      const comparison = TaxCalculator.compareTaxRegimes(
        state.income,
        state.deductions
      );
      dispatch({ type: 'CALCULATE_TAX_SUCCESS', payload: comparison });
    } catch (error) {
      dispatch({
        type: 'CALCULATE_TAX_ERROR',
        payload: error instanceof Error ? error.message : 'Calculation failed',
      });
    }
  };

  const resetCalculator = () => {
    dispatch({ type: 'RESET_CALCULATOR' });
  };

  const value: TaxContextType = {
    state,
    updateIncome,
    updateDeductions,
    calculateTax,
    resetCalculator,
  };

  return <TaxContext.Provider value={value}>{children}</TaxContext.Provider>;
}

export function useTax() {
  const context = useContext(TaxContext);
  if (context === undefined) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
}
