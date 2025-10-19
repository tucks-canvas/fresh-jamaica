module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            // Core directories
            '@': './src',
            '@/constants': './constants',
            '@components': './components',
            '@contexts': './contexts',
            '@hooks': './hooks',
            '@services': './services',
            '@utils': './utils',
            
            // Screen directories
            '@auth': './app/(screens)/(auth)',
            '@customers': './app/(screens)/(customers)',
            '@farmers': './app/(screens)/(farmers)',
            '@delivery': './app/(screens)/(delivery)',
            '@admin': './app/(screens)/(admin)',
            '@load': './app/(screens)/(load)',
            '@screens': './app/(screens)',
          },
        },
      ],
    ],
  };
};