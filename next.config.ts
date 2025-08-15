import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Bundle analyzer configuration (commented out for now)
  // webpack: (config) => {
  //   if (process.env.ANALYZE === 'true') {
  //     const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer');
  //     config.plugins.push(new BundleAnalyzerPlugin());
  //   }
  //   return config;
  // },

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Experimental features for better performance
  experimental: {
    // optimizeCss: true, // Disabled due to critters dependency
    optimizePackageImports: ['@heroicons/react', 'recharts'],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
