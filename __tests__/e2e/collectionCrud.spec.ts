import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import type { Page } from '@playwright/test';
const titleInput = (page: Page) => page.getByPlaceholder('Título da coleção', { exact: true });
const IMAGE = 'http://localhost:5173/assets/collection.jpg';

// E2E: o fluxo inteiro fica em um teste só (criar, listar, editar, excluir),
// com asserções a cada passo. Não segue o Arrange/Act/Assert à risca.
test('Deve cadastrar, listar, editar e excluir uma coleção', async ({ page }) => {
  const suffix = faker.string.alphanumeric(8);
  const title = `Coleção E2E ${suffix}`;
  const editedTitle = `Coleção E2E editada ${suffix}`;
  const subtitle = faker.word.words(5);
  const editedSubtitle = faker.word.words(5);
  const author = faker.person.fullName();

  await page.goto('http://localhost:5173');
  await expect(page.getByRole('button', { name: 'Adicionar coleção' })).toBeVisible();

  // Cadastrar
  await page.getByRole('button', { name: 'Adicionar coleção' }).click();
  await expect(titleInput(page)).toBeVisible();
  await titleInput(page).fill(title);
  await page.getByPlaceholder('Subtítulo da coleção').fill(subtitle);
  await page.getByPlaceholder('Link para imagem de capa').fill(IMAGE);
  await page.getByPlaceholder('Autor da coleção').fill(author);
  await page.getByRole('button', { name: 'Salvar' }).click();

  // Modal fecha e a coleção aparece na lista
  await expect(titleInput(page)).toBeHidden();
  const item = page.locator('ul > div').filter({
    has: page.getByRole('heading', { name: title, level: 3, exact: true }),
  });
  await expect(item).toHaveCount(1);
  await expect(item.getByRole('heading', { level: 4 })).toHaveText(subtitle);
  await expect(item.getByText(author, { exact: true })).toBeVisible();

  // Listar: persiste após recarregar a página (veio da API)
  await page.reload();
  await expect(page.getByRole('heading', { name: title, level: 3, exact: true })).toBeVisible();

  // Editar: o modal abre preenchido com os dados atuais
  await item.getByRole('button', { name: 'Editar' }).click();
  await expect(titleInput(page)).toHaveValue(title);
  await expect(page.getByPlaceholder('Subtítulo da coleção')).toHaveValue(subtitle);
  await expect(page.getByPlaceholder('Autor da coleção')).toHaveValue(author);

  await titleInput(page).fill(editedTitle);
  await page.getByPlaceholder('Subtítulo da coleção').fill(editedSubtitle);
  await page.getByRole('button', { name: 'Salvar' }).click();

  await expect(titleInput(page)).toBeHidden();
  const edited = page.locator('ul > div').filter({
    has: page.getByRole('heading', { name: editedTitle, level: 3, exact: true }),
  });
  await expect(edited).toHaveCount(1);
  await expect(edited.getByRole('heading', { level: 4 })).toHaveText(editedSubtitle);
  await expect(page.getByRole('heading', { name: title, level: 3, exact: true })).toHaveCount(0);

  // A edição persiste após recarregar
  await page.reload();
  await expect(
    page.getByRole('heading', { name: editedTitle, level: 3, exact: true })
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: title, level: 3, exact: true })).toHaveCount(0);

  // Excluir: cancelar a confirmação mantém a coleção
  page.once('dialog', dialog => dialog.dismiss());
  await edited.getByRole('button', { name: 'Excluir' }).click();
  await expect(edited).toHaveCount(1);

  // Excluir: confirmar remove a coleção
  page.once('dialog', dialog => dialog.accept());
  await edited.getByRole('button', { name: 'Excluir' }).click();
  await expect(edited).toHaveCount(0);

  // A exclusão persiste após recarregar
  await page.reload();
  await expect(page.getByRole('button', { name: 'Adicionar coleção' })).toBeVisible();
  await expect(page.getByRole('heading', { name: editedTitle, level: 3, exact: true })).toHaveCount(
    0
  );
});
