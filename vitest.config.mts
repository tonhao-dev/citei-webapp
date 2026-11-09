import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      include: ['__tests__/**/*.test.{ts,tsx}'],
      // Contratos rodam à parte, em Node: npm run test:pact
      exclude: ['**/node_modules/**', '__tests__/pact/**'],
      // Os arquivos *.spec.ts em __tests__/e2e pertencem ao Playwright.
      css: { modules: { classNameStrategy: 'non-scoped' } },
      clearMocks: true,
    },
  })
);
