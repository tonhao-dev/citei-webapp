import { defineConfig, devices } from '@playwright/test';

// O app roda em outro container (BASE_URL). A API é falsa, veja tests/.
const BASE_URL = process.env.BASE_URL ?? 'http://app';

export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: '{testDir}/__snapshots__/{arg}-{projectName}{ext}',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  expect: {
    toHaveScreenshot: {
      // Até 0,1% dos pixels pode mudar (serrilhado das letras).
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: BASE_URL,
    deviceScaleFactor: 1,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    reducedMotion: 'reduce',
    // Vídeo de todo teste; trace (passo a passo) só quando o teste falha.
    video: 'on',
    trace: 'retain-on-failure',
    launchOptions: { args: ['--disable-lcd-text', '--font-render-hinting=none'] },
  },
  projects: [
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 720 } } },
  ],
});
