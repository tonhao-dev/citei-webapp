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
      // Os arquivos *.spec.ts em __tests__/e2e pertencem ao Playwright.
      css: { modules: { classNameStrategy: 'non-scoped' } },
      clearMocks: true,
    },
  })
);
