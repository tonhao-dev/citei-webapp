import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  testDir: './__tests__/e2e/ui',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0,
      maxDiffPixels: 0,
      threshold: 0.1,
    },
  },
  snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{projectName}/{arg}{ext}',
});
