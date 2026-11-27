import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';
import Collection from '../../src/containers/collection';
import { collection } from '../../__tests__/factory/collection';
import { collectionService as collectionServiceFactory } from '../../__tests__/factory/collectionService';

type CollectionService = ReturnType<typeof collectionServiceFactory>;

const renderCollection = (collectionService: CollectionService) =>
  act(async () => render(<Collection collectionService={collectionService} />));

let emptyCollectionService: CollectionService;

beforeEach(() => {
  // Arrange
  vi.spyOn(window, 'alert').mockImplementation(() => {});
  emptyCollectionService = collectionServiceFactory({
    getValidCollections: vi.fn().mockResolvedValue([]),
  });
});

afterEach(() => {
  // Teardown
  cleanup();
  vi.restoreAllMocks();
});

describe('/containers/collection', () => {
  describe('Deve exibir a tela de coleções corretamente quando nenhuma coleção for injetada', () => {
    it('Deve exibir o título da página quando ela for carregada', async () => {
      // Arrange
      const collectionService = emptyCollectionService;

      // Act
      await renderCollection(collectionService);

      // Assert
      expect(screen.getByRole('heading', { name: 'Citei' })).toBeInTheDocument();
    });

    it('Deve renderizar uma lista de coleções vazia quando nenhuma coleção for injetada', async () => {
      // Arrange
      const collectionService = emptyCollectionService;

      // Act
      await renderCollection(collectionService);

      // Assert
      expect(screen.queryByRole('list')).toBeEmptyDOMElement();
    });

    it('Deve exibir o botão de "Adicionar coleção"', async () => {
      // Arrange
      const collectionService = emptyCollectionService;

      // Act
      await renderCollection(collectionService);

      // Assert
      expect(screen.getByText('Adicionar coleção')).toBeInTheDocument();
    });

    it('Deve exibir o subtítulo da página quando ela for carregada', async () => {
      // Arrange
      const collectionService = emptyCollectionService;

      // Act
      await renderCollection(collectionService);

      // Assert
      expect(
        screen.getByRole('heading', {
          name: 'Coleções, seu conjunto de citações em reunidos em lugar.',
        })
      ).toBeInTheDocument();
    });

    it('Deve exibir um ícone de buscar quando a página for carregada', async () => {
      // Arrange
      const collectionService = emptyCollectionService;

      // Act
      await renderCollection(collectionService);

      // Assert
      expect(screen.getByLabelText('search-icon')).toBeInTheDocument();
    });

    it('Deve esconder o título da página quando o icone de buscar for pressionado', async () => {
      // Arrange
      await renderCollection(emptyCollectionService);

      // Act
      await act(async () => userEvent.click(screen.getByLabelText('search-icon')));

      // Assert
      expect(screen.queryByText('Citei')).toBe(null);
    });

    it('Deve esconder o subtítulo da página quando o icone de buscar for pressionado', async () => {
      // Arrange
      await renderCollection(emptyCollectionService);

      // Act
      await act(async () => userEvent.click(screen.getByLabelText('search-icon')));

      // Assert
      expect(screen.queryByText('Coleções, seu conjunto de citações em reunidos em lugar.')).toBe(
        null
      );
    });
  });

  describe('Deve renderizar as coleções corretamente quando elas forem injetadas via prop', () => {
    it('Deve exibir o nome das coleções que foram injetadas via serviço de coleções', async () => {
      // Arrange
      const collections = Array.from(Array(faker.number.int({ min: 1, max: 10 }))).map(() =>
        collection({
          title: faker.word.words(2),
        })
      );
      const collectionService = collectionServiceFactory({
        getValidCollections: vi.fn().mockResolvedValue(collections),
      });

      // Act
      await renderCollection(collectionService);

      // Assert
      collections.forEach(({ title }) => expect(screen.getByText(title)).toBeInTheDocument());
    });
  });

  describe('Deve exibir corretamente o modal de adicionar coleção', () => {
    it('Deve exibir um campo para inserir o título da coleção', async () => {
      // Arrange
      await renderCollection(emptyCollectionService);

      // Act
      await userEvent.click(screen.getByText('Adicionar coleção'));

      // Assert
      expect(screen.getByPlaceholderText('Título da coleção')).toBeVisible();
    });

    it('Deve exibir um campo para inserir o subtítulo da coleção', async () => {
      // Arrange
      await renderCollection(emptyCollectionService);

      // Act
      await userEvent.click(screen.getByText('Adicionar coleção'));

      // Assert
      expect(screen.getByPlaceholderText('Subtítulo da coleção')).toBeVisible();
    });

    it('Deve exibir um campo para inserir link da imagem de capa da coleção', async () => {
      // Arrange
      await renderCollection(emptyCollectionService);

      // Act
      await userEvent.click(screen.getByText('Adicionar coleção'));

      // Assert
      expect(screen.getByPlaceholderText('Link para imagem de capa')).toBeVisible();
    });

    it('Deve exibir um campo para inserir o nome do autor da coleção', async () => {
      // Arrange
      await renderCollection(emptyCollectionService);

      // Act
      await userEvent.click(screen.getByText('Adicionar coleção'));

      // Assert
      expect(screen.getByPlaceholderText('Autor da coleção')).toBeVisible();
    });

    it('Deve esconder o modal quando o usuário clicar no ícone de fechar', async () => {
      // Arrange
      await renderCollection(emptyCollectionService);
      await userEvent.click(screen.getByText('Adicionar coleção'));

      // Act
      await userEvent.click(screen.getByLabelText('modal-close'));

      // Assert
      expect(screen.queryByPlaceholderText('Título da coleção')).not.toBeInTheDocument();
    });

    it('Deve exibir o botão de salvar a coleção', async () => {
      // Arrange
      await renderCollection(emptyCollectionService);

      // Act
      await userEvent.click(screen.getByText('Adicionar coleção'));

      // Assert
      expect(screen.getByText('Salvar')).toBeVisible();
    });

    it('Deve esconder o modal quando o usuário clicar no botão "Salvar" após inserir todas as informações corretamente', async () => {
      // Arrange
      const collectionService = collectionServiceFactory();
      const newCollection = collection();
      await renderCollection(collectionService);
      await userEvent.click(screen.getByText('Adicionar coleção'));
      await userEvent.type(screen.getByPlaceholderText('Título da coleção'), newCollection.title);
      await userEvent.type(
        screen.getByPlaceholderText('Subtítulo da coleção'),
        newCollection.subtitle
      );
      await userEvent.type(
        screen.getByPlaceholderText('Link para imagem de capa'),
        newCollection.image.url
      );
      await userEvent.type(screen.getByPlaceholderText('Autor da coleção'), newCollection.author);

      // Act
      await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

      // Assert
      expect(window.alert).toHaveBeenCalledTimes(0);
      expect(screen.queryByText('Salvar')).toBe(null);
    });
  });

  describe('Deve manter o modal aberto quando o usuário clicar no botão salvar após inserir alguma informação incorreta', () => {
    it('Deve manter o modal aberto quando o usuário clicar no botão de Salvar coleção após não inserir o título da coleção', async () => {
      // Arrange
      const collections = Array.from(Array(faker.number.int({ min: 1, max: 10 }))).map(() =>
        collection()
      );
      const collectionService = collectionServiceFactory({
        getValidCollections: vi.fn().mockResolvedValue(collections),
        isValidCollection: () => false,
      });
      await renderCollection(collectionService);
      await userEvent.click(screen.getByText('Adicionar coleção'));

      // Act
      await userEvent.click(screen.getByText('Salvar'));

      // Assert
      expect(screen.getByText('Salvar')).toBeVisible();
    });
  });

  describe('Deve filtrar as coleções corretamente', () => {
    it('Deve exibir a coleção cujo titulo foi digitado no campo de busca', async () => {
      // Arrange
      const collections = Array.from(Array(faker.number.int({ min: 4, max: 10 }))).map(() =>
        collection({
          title: faker.word.words(2),
        })
      );
      const searchCollection = faker.helpers.arrayElement(collections);
      const collectionService = collectionServiceFactory({
        getValidCollections: vi.fn().mockResolvedValue(collections),
        filterCollections: (name, collections) =>
          collections.filter(collection => collection.title === name),
      });
      await renderCollection(collectionService);
      await userEvent.click(screen.getByLabelText('search-icon'));

      // Act
      await userEvent.type(screen.getByRole('textbox'), searchCollection.title);

      // Assert
      expect(screen.getByText(searchCollection.title)).toBeInTheDocument();
    });

    it('Deve esconder as coleções cujo título não é igual ao título digitado no campo de busca', async () => {
      // Arrange
      const collections = Array.from(Array(faker.number.int({ min: 4, max: 10 }))).map(() =>
        collection({
          title: faker.word.words(2),
        })
      );
      const [first, second] = faker.helpers.arrayElements(collections, 2);
      const collectionService = collectionServiceFactory({
        getValidCollections: vi.fn().mockResolvedValue(collections),
        filterCollections: (name, collections) =>
          collections.filter(collection => collection.title === name),
      });
      await renderCollection(collectionService);
      await userEvent.click(screen.getByLabelText('search-icon'));

      // Act
      await userEvent.type(screen.getByRole('textbox'), first.title);

      // Assert
      expect(screen.queryByText(second.title)).toBe(null);
    });
  });
});
