import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// Testes de contrato (Pact). Rodam em Node: o axios usa http de verdade
// e fala com o mock server do Pact, nunca com o backend.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'node',
      include: ['__tests__/pact/**/*.pact.test.ts'],
      testTimeout: 30000,
    },
  })
);
