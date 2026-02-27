import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import type { IRawCollection } from '../../src/interfaces/collection';

function createCollection(): IRawCollection {
  return {
    title: faker.word.words(2),
    subtitle: faker.word.words(7),
    author: faker.person.fullName(),
    image: 'http://localhost:5173/assets/collection.jpg',
  };
}

async function addCollection(page: Page, data: IRawCollection) {
  await page.getByRole('button', { name: 'Adicionar coleção' }).click();
  await page.getByPlaceholder('Título da coleção', { exact: true }).fill(data.title);
  await page.getByPlaceholder('Subtítulo da coleção').fill(data.subtitle);
  await page.getByPlaceholder('Link para imagem de capa').fill(data.image);
  await page.getByPlaceholder('Autor da coleção').fill(data.author);
  await page.getByRole('button', { name: 'Salvar' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.getByRole('button', { name: 'Adicionar coleção' }).waitFor();
});

test.describe('e2e/collection', () => {
  test.describe('Deve carregar a página de coleções corretamente', () => {
    test('Deve exibir o botão de adicionar coleção quando ela for carregada', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Adicionar coleção' })).toBeVisible();
    });
  });

  test.describe('Deve exibir corretamente o modal de cadastrar coleção', () => {
    test('Deve exibir a coleção que foi adicionada pelo usuário através do modal de adicionar coleção', async ({
      page,
    }) => {
      const newCollection = createCollection();
      await addCollection(page, newCollection);

      await expect(
        page.getByRole('heading', { name: newCollection.title, level: 3 })
      ).toBeVisible();
    });
  });

  test.describe('Deve filtrar as coleções corretamente', () => {
    test('Deve exibir a coleção cujo título foi digitado no campo de buscar', async ({ page }) => {
      const collectionOne = createCollection();
      const collectionTwo = createCollection();

      await addCollection(page, collectionOne);
      await addCollection(page, collectionTwo);

      await page.getByRole('img', { name: 'search-icon' }).click();
      await page.getByRole('textbox').fill(collectionOne.title);

      await expect(
        page.getByRole('heading', { name: collectionOne.title, level: 3 })
      ).toBeVisible();
    });

    test('Não deve exibir uma coleção quando o título digitado não for igual ao da coleção criada', async ({
      page,
    }) => {
      const collectionOne = createCollection();
      const collectionTwo = createCollection();

      await addCollection(page, collectionOne);
      await addCollection(page, collectionTwo);

      await page.getByRole('img', { name: 'search-icon' }).click();
      await page.getByRole('textbox').fill(collectionOne.title);

      await expect(
        page.getByRole('heading', { name: collectionTwo.title, level: 3 })
      ).not.toBeVisible();
    });
  });
});
