const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src'),
};

config.resolver.alias = {
  // Core directories
  '@/constants': path.resolve(__dirname, 'src/constants'),
  '@/constants/colors': path.resolve(__dirname, 'src/constants/colors'),
  '@/constants/images': path.resolve(__dirname, 'src/constants/images'),
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/contexts': path.resolve(__dirname, 'src/contexts'),
  '@/hooks': path.resolve(__dirname, 'src/hooks'),
  '@/services': path.resolve(__dirname, 'src/services'),
  '@/utils': path.resolve(__dirname, 'src/utils'),
  
  // Screen directories
  '@/auth': path.resolve(__dirname, 'src/app/(screens)/(auth)'),
  '@/customers': path.resolve(__dirname, 'src/app/(screens)/(customers)'),
  '@/farmers': path.resolve(__dirname, 'src/app/(screens)/(farmers)'),
  '@/delivery': path.resolve(__dirname, 'src/app/(screens)/(delivery)'),
  '@/admin': path.resolve(__dirname, 'src/app/(screens)/(admin)'),
  '@/load': path.resolve(__dirname, 'src/app/(screens)/(load)'),
  '@/screens': path.resolve(__dirname, 'src/app/(screens)'),
};

module.exports = config;