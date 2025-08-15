# 🚀 Production Readiness Guide

This document outlines the production-ready tools, scripts, and configurations for the Tax Calculator application.

## 📋 Available Scripts

### 🏗️ Build Scripts
- **`npm run build`** - Standard production build
- **`npm run build:prod`** - Production build with NODE_ENV=production
- **`npm run build:analyze`** - Build with bundle analysis (requires ANALYZE=true)

### 🧹 Cleanup Scripts
- **`npm run clean`** - Remove build artifacts (.next, out)
- **`npm run clean:all`** - Full cleanup (build artifacts + node_modules + package-lock.json)

### 🔍 Quality Assurance Scripts
- **`npm run lint`** - Run ESLint checks
- **`npm run lint:fix`** - Run ESLint with auto-fix
- **`npm run type-check`** - Run TypeScript type checking
- **`npm run format`** - Format code with Prettier
- **`npm run format:check`** - Check code formatting
- **`npm run check`** - Run all quality checks (lint + type-check + format)

### 🚀 Development Scripts
- **`npm run dev`** - Start development server with Turbopack
- **`npm run start`** - Start production server

## 🛠️ Production Tools

### ESLint Configuration
- **File**: `eslint.config.mjs`
- **Rules**: Production-ready rules with warnings for code quality issues
- **Integration**: Next.js core web vitals and TypeScript rules

### Prettier Configuration
- **File**: `.prettierrc`
- **Features**: Consistent code formatting across the project
- **Integration**: Works with ESLint for code quality

### Next.js Configuration
- **File**: `next.config.ts`
- **Features**:
  - Production optimizations (compression, security headers)
  - Image optimization (WebP, AVIF)
  - Package import optimization
  - Bundle analyzer integration
  - Security headers (X-Frame-Options, CSP, etc.)

### Environment Configuration
- **File**: `env.example`
- **Variables**:
  - `NODE_ENV` - Environment mode
  - `ANALYZE` - Enable bundle analysis
  - `NEXT_PUBLIC_*` - Public environment variables

## 🔒 Security Features

### Security Headers
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME type sniffing)
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricts camera, microphone, geolocation

### Production Optimizations
- **Powered-by header**: Removed for security
- **ETags**: Disabled for better caching control
- **Compression**: Enabled for better performance

## 📊 Bundle Analysis

### Enabling Bundle Analysis
```bash
# Set environment variable
set ANALYZE=true

# Run build with analysis
npm run build:analyze
```

### Analysis Output
- **File**: `bundle-analysis.html` (in project root)
- **Features**: Interactive bundle size visualization
- **Usage**: Open in browser to analyze bundle composition

## 🧪 Quality Checks

### Pre-commit Checklist
```bash
# Run all quality checks
npm run check

# This includes:
# 1. ESLint (code quality)
# 2. TypeScript type checking
# 3. Prettier formatting check
```

### Continuous Integration
The `check` script is designed to be run in CI/CD pipelines to ensure code quality.

## 🚀 Deployment

### Production Build
```bash
# Clean build
npm run clean

# Production build
npm run build:prod

# Start production server
npm run start
```

### Environment Variables
Ensure the following are set in production:
- `NODE_ENV=production`
- Any required `NEXT_PUBLIC_*` variables

## 📈 Performance Monitoring

### Bundle Size Targets
- **First Load JS**: < 250KB (Current: 238KB ✅)
- **Individual Routes**: < 150KB (Current: 134KB ✅)
- **Shared Chunks**: < 100KB (Current: 99.7KB ✅)

### Optimization Features
- **Package Import Optimization**: @heroicons/react, recharts
- **Image Formats**: WebP, AVIF support
- **Code Splitting**: Automatic route-based splitting

## 🐛 Troubleshooting

### Common Issues

#### Bundle Analyzer Not Working
```bash
# Check if @next/bundle-analyzer is installed
npm list @next/bundle-analyzer

# Reinstall if needed
npm install --save-dev @next/bundle-analyzer
```

#### Build Failures
```bash
# Clean and rebuild
npm run clean:all
npm install
npm run build
```

#### ESLint Errors
```bash
# Auto-fix what's possible
npm run lint:fix

# Check specific files
npx next lint src/components/calculator/TaxCalculator.tsx
```

## 📚 Best Practices

### Code Quality
1. **Always run `npm run check` before committing**
2. **Fix ESLint warnings** (they're warnings, not errors)
3. **Use TypeScript strict mode** for better type safety
4. **Follow Prettier formatting** for consistency

### Performance
1. **Monitor bundle sizes** with `npm run build:analyze`
2. **Optimize imports** using Next.js package optimization
3. **Use dynamic imports** for code splitting when appropriate
4. **Optimize images** using Next.js Image component

### Security
1. **Keep dependencies updated** regularly
2. **Review security headers** in production
3. **Validate environment variables** before deployment
4. **Monitor for security vulnerabilities** in dependencies

## 🔄 Maintenance

### Regular Tasks
- **Weekly**: Run `npm audit` for security updates
- **Monthly**: Update dependencies with `npm update`
- **Quarterly**: Review and update security headers
- **As needed**: Run bundle analysis for performance monitoring

### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update specific packages
npm install package@latest
```

---

## 📞 Support

For production issues or questions:
1. Check this README first
2. Review the main README.md
3. Check the development plan in DEVELOPMENT_PLAN.md
4. Review build logs and error messages

**Remember**: Production deployments should always go through the full `npm run check` process! 🚀
