import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Regressão visual da página de coleção (/).
 * A API é falsa: o Playwright responde no lugar dela com dados fixos,
 * então a imagem não muda por causa de dados.
 */

const BASE_URL = process.env.BASE_URL ?? 'http://app';
// Endereço que o app recebeu no build (VITE_API_URL). Ninguém responde nele de verdade.
const API_URL = process.env.API_URL ?? 'http://api.test';

const capa = `${BASE_URL}/assets/collection.jpg`;

const COLLECTIONS = [
  {
    colecao_id: 1,
    colecao_titulo: 'Estoicismo',
    colecao_subtitulo: 'Frases para dias difíceis',
    colecao_imagem: capa,
    colecao_autor: 'Sêneca',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    colecao_id: 2,
    colecao_titulo: 'Epicurismo',
    colecao_subtitulo: 'A busca do prazer simples',
    colecao_imagem: capa,
    colecao_autor: 'Epicuro',
    created_at: '2026-01-02T00:00:00.000Z',
  },
  {
    colecao_id: 3,
    colecao_titulo: 'Existencialismo',
    colecao_subtitulo: 'Liberdade e responsabilidade',
    colecao_imagem: capa,
    colecao_autor: 'Simone de Beauvoir',
    created_at: '2026-01-03T00:00:00.000Z',
  },
];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

async function openApp(page: Page, rows: object[] = COLLECTIONS) {
  await page.route(`${API_URL}/colecao**`, async route => {
    const request = route.request();
    if (request.method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: CORS });
    }
    if (request.method() === 'POST') {
      const body = request.postDataJSON();
      return route.fulfill({
        status: 200,
        headers: CORS,
        contentType: 'application/json',
        body: JSON.stringify({ id: 99, created_at: '2026-01-04T00:00:00.000Z', ...body }),
      });
    }
    return route.fulfill({
      status: 200,
      headers: CORS,
      contentType: 'application/json',
      body: JSON.stringify(rows),
    });
  });

  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Citei' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Array.from(document.images).every(image => image.complete));
}

test.afterEach(async ({ page }) => {
  // Teardown
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});

test.describe('página de coleção', () => {
  test('página vazia', async ({ page }) => {
    // Arrange
    await openApp(page, []);

    // Act
    await page.getByRole('button', { name: 'Adicionar coleção' }).waitFor();

    // Assert
    await expect(page).toHaveScreenshot('pagina-vazia.png');
  });

  test('página com coleções', async ({ page }) => {
    // Arrange
    await openApp(page);

    // Act
    await page.getByText('Estoicismo').waitFor();

    // Assert
    await expect(page).toHaveScreenshot('pagina-com-colecoes.png');
  });

  test('busca aberta', async ({ page }) => {
    // Arrange
    await openApp(page);
    await page.getByText('Estoicismo').waitFor();

    // Act
    await page.getByLabel('search-icon').click();
    await page.getByRole('textbox').fill('epic');

    // Assert
    await expect(page).toHaveScreenshot('busca-aberta.png');
  });

  test('modal de adicionar coleção', async ({ page }) => {
    // Arrange
    await openApp(page);
    await page.getByText('Estoicismo').waitFor();

    // Act
    await page.getByRole('button', { name: 'Adicionar coleção' }).click();
    await page.getByPlaceholder('Título da coleção', { exact: true }).waitFor();

    // Assert
    await expect(page).toHaveScreenshot('modal-adicionar-colecao.png');
  });

  test('modal preenchido', async ({ page }) => {
    // Arrange
    await openApp(page);
    await page.getByRole('button', { name: 'Adicionar coleção' }).click();

    // Act
    await page.getByPlaceholder('Título da coleção', { exact: true }).fill('Nova coleção');
    await page.getByPlaceholder('Subtítulo da coleção').fill('Um subtítulo');
    await page.getByPlaceholder('Link para imagem de capa').fill('https://exemplo.com/capa.jpg');
    await page.getByPlaceholder('Autor da coleção').fill('Fulano');

    // Assert
    await expect(page).toHaveScreenshot('modal-preenchido.png');
  });
});
