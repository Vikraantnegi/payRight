'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CalculatorIcon,
  HomeIcon,
  BanknotesIcon,
  ArrowRightIcon,
  StarIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  UsersIcon,
  RocketLaunchIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const features = [
    {
      icon: CheckCircleIcon,
      title: "Accurate Calculations",
      description: "Updated for AY 2026-27 with latest tax slabs and regulations"
    },
    {
      icon: ShieldCheckIcon,
      title: "Professional Grade",
      description: "Built with modern web technologies and best practices"
    },
    {
      icon: UsersIcon,
      title: "User-Friendly",
      description: "Intuitive interface designed for both beginners and experts"
    },
    {
      icon: RocketLaunchIcon,
      title: "Lightning Fast",
      description: "Real-time calculations with instant results and feedback"
    }
  ];

  const calculators = [
    {
      id: 'tax',
      title: 'Tax Calculator',
      subtitle: 'Compare Old vs New Tax Regime',
      description: 'Make informed decisions about your tax strategy. Compare both regimes side-by-side with detailed breakdowns, visual charts, and personalized recommendations.',
      icon: CalculatorIcon,
      color: 'blue',
      features: ['AY 2026-27 Updated', 'Visual Comparisons', 'Smart Recommendations', 'Detailed Breakdowns'],
      image: '/api/placeholder/400/300'
    },
    {
      id: 'hra',
      title: 'HRA Calculator',
      subtitle: 'Optimize Your HRA Exemptions',
      description: 'Maximize your tax savings through HRA optimization. Calculate required rent, understand exemptions, and get actionable insights for better financial planning.',
      icon: HomeIcon,
      color: 'green',
      features: ['Two Calculation Scenarios', 'City-based Limits', 'Rent Optimization', 'Tax Savings Analysis'],
      image: '/api/placeholder/400/300'
    },
    {
      id: 'salary',
      title: 'Salary Calculator',
      subtitle: 'Understand Your Take-Home Pay',
      description: 'Get complete visibility into your salary structure. Calculate pre-tax and post-tax earnings with detailed breakdowns of all components and deductions.',
      icon: BanknotesIcon,
      color: 'purple',
      features: ['Complete Salary Breakdown', 'Tax Regime Comparison', 'Deduction Analysis', 'Monthly In-Hand'],
      image: '/api/placeholder/400/300'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-indigo-600';
      case 'green':
        return 'from-green-500 to-emerald-600';
      case 'purple':
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  const getBorderColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-200';
      case 'green':
        return 'border-green-200';
      case 'purple':
        return 'border-purple-200';
      default:
        return 'border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
          <div className="text-center space-y-8">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
                <CalculatorIcon className="h-10 w-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  payRight
                </h1>
                <p className="text-lg text-gray-600 font-medium">Your Financial Planning Companion</p>
              </div>
            </div>
            
            {/* Hero Description */}
            <p className="text-2xl lg:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
              Comprehensive financial tools to help you <span className="font-semibold text-blue-600">optimize taxes</span>, 
              <span className="font-semibold text-green-600"> maximize savings</span>, and 
              <span className="font-semibold text-purple-600"> plan your future</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                href="/calculators"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center space-x-3 shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transform"
              >
                <span>Start Calculating Now</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="#products"
                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl transition-all duration-200 flex items-center space-x-3 border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl"
              >
                <span>Explore Products</span>
                <TrendingUpIcon className="h-5 w-5" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span>Updated for AY 2026-27</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
                <span>Professional Grade</span>
              </div>
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-5 w-5 text-purple-500" />
                <span>User-Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center space-y-6 mb-20">
            <div className="flex items-center justify-center space-x-2">
              <SparklesIcon className="h-8 w-8 text-yellow-500" />
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Our Financial Tools</h2>
              <SparklesIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Three powerful calculators designed to give you complete control over your financial planning
            </p>
          </div>

          {/* Products Grid */}
          <div className="space-y-16">
            {calculators.map((calculator, index) => (
              <div key={calculator.id} className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Product Image */}
                <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(calculator.color)} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                    <div className={`relative bg-gradient-to-br ${getColorClasses(calculator.color)} rounded-3xl p-8 shadow-2xl transform group-hover:scale-105 transition-all duration-300`}>
                      <div className="flex items-center justify-center h-64">
                        <calculator.icon className="h-32 w-32 text-white opacity-90" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Content */}
                <div className={`order-1 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="space-y-6">
                    {/* Product Badge */}
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
                      <calculator.icon className={`h-5 w-5 text-${calculator.color}-600`} />
                      <span className="text-sm font-medium text-gray-700">{calculator.subtitle}</span>
                    </div>

                    {/* Product Title */}
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {calculator.title}
                    </h3>

                    {/* Product Description */}
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {calculator.description}
                    </p>

                    {/* Product Features */}
                    <div className="space-y-3">
                      {calculator.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <Link
                        href={`/calculators?calculator=${calculator.id}`}
                        className={`inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${getColorClasses(calculator.color)} hover:scale-105 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform`}
                      >
                        <span>Try {calculator.title}</span>
                        <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Why Choose PayRight?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with modern technology and user experience in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses('blue')} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Optimize Your Finances?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of users who trust PayRight for their financial planning needs
          </p>
          <Link
            href="/calculators"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-2xl transition-all duration-200 shadow-2xl hover:shadow-white/25 hover:scale-105 transform"
          >
            <span>Get Started Now</span>
            <RocketLaunchIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <CalculatorIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">payRight</span>
          </div>
          <p className="text-gray-400 mb-6">
            Your comprehensive financial planning companion for tax optimization, salary analysis, and HRA calculations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <span>© 2025 PayRight. All rights reserved.</span>
            <span>•</span>
            <span>Built with Next.js & Tailwind CSS</span>
            <span>•</span>
            <span>Inspired by Aceternity UI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
