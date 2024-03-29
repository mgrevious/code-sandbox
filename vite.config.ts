import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

type ViteConfigInput = {
  mode: string;
  command: string;
};

// https://vitejs.dev/config/
export default (args: ViteConfigInput) => {
  const generateScopedName =
    args.mode === 'production'
      ? '[hash:base64:5]'
      : '[name]__[local]___[hash:base64:5]';

  return defineConfig({
    plugins: [react(), eslint()],
    css: {
      modules: {
        // enable camel case when referencing css module properties
        localsConvention: 'camelCase',
        // control how module class names are generated
        generateScopedName,
      },
    },
  });
};
