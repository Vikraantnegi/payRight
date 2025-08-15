'use client';

import React from 'react';
import Link from 'next/link';
import { TaxProvider } from '@/lib/TaxContext';
import { TaxCalculator } from '@/components/calculator/TaxCalculator';
import { 
  CalculatorIcon,
  HomeIcon,
  BanknotesIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <TaxProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <CalculatorIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-800">
                payRight
              </h1>
            </div>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed opacity-80">
              Your comprehensive financial planning companion for tax optimization, salary analysis, and HRA calculations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/calculators"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-3 shadow-lg hover:scale-105 transform"
              >
                <span>Explore All Calculators</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#main-calculator"
                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center space-x-3 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
              >
                <span>Try Tax Calculator</span>
                <CalculatorIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-8">
            <h2 className="text-3xl font-semibold text-gray-800 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 mx-auto">
                  <CalculatorIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Tax Calculator</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Compare Old vs New Tax Regime for AY 2026-27. Get detailed breakdowns, visual charts, and personalized recommendations.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6 mx-auto">
                  <HomeIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">HRA Calculator</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Optimize your HRA exemptions with two scenarios: calculate required rent or determine exemption based on actual rent.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mb-6 mx-auto">
                  <BanknotesIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Salary Calculator</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Understand your complete salary structure with pre-tax and post-tax calculations, deductions, and take-home pay.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-semibold text-gray-800">Why Choose payRight?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto">
                    <StarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="font-semibold text-gray-800">Accurate Calculations</div>
                  <div className="text-sm text-gray-600">Updated for AY 2026-27 tax slabs</div>
                </div>
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto">
                    <StarIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="font-semibold text-gray-800">User-Friendly</div>
                  <div className="text-sm text-gray-600">Intuitive interface with step-by-step guidance</div>
                </div>
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto">
                    <StarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="font-semibold text-gray-800">Comprehensive</div>
                  <div className="text-sm text-gray-600">All-in-one financial planning tools</div>
                </div>
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto">
                    <StarIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="font-semibold text-gray-800">Professional</div>
                  <div className="text-sm text-gray-600">Built with modern web technologies</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Tax Calculator */}
          <div id="main-calculator" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-semibold text-gray-800">Main Tax Calculator</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Start with our comprehensive tax calculator to compare Old vs New Tax Regime
              </p>
            </div>
            <TaxCalculator />
          </div>
        </div>
      </div>
    </TaxProvider>
  );
}
