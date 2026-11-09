import { test, fc } from '@fast-check/vitest';
import { CollectionService } from '../../src/service/collection';
import { ImageURL } from '../../src/entities/url';
import type { ICollection, IServiceCollectionResponse } from '../../src/interfaces/collection';
import type { ICollectionRepository } from '../../src/repository/collection';

const image = new ImageURL('http://localhost:5173/assets/collection.jpg');

const collectionArb: fc.Arbitrary<ICollection> = fc.record({
  id: fc.integer({ min: 1 }),
  title: fc.string(),
  subtitle: fc.string(),
  author: fc.string(),
  image: fc.constant(image),
});

const responseArb: fc.Arbitrary<IServiceCollectionResponse> = fc.record({
  id: fc.integer({ min: 1 }),
  titulo: fc.string(),
  subtitulo: fc.string(),
  autor: fc.string(),
  imagem: fc.webUrl(),
  created_at: fc.constant('2026-01-01T00:00:00.000Z') as fc.Arbitrary<IServiceCollectionResponse['created_at']>,
});

function serviceWith(repository: Partial<ICollectionRepository> = {}) {
  return new CollectionService({
    getAll: vi.fn().mockResolvedValue([]),
    saveOne: vi.fn(),
    ...repository,
  } as ICollectionRepository);
}

describe('service/collection (propriedades)', () => {
  afterEach(() => {
    // Teardown
    vi.restoreAllMocks();
  });

  describe('filterCollections', () => {
    test.prop([fc.string(), fc.array(collectionArb)])(
      'deve devolver só coleções cujo título contém o texto, sem diferenciar maiúsculas',
      (text, collections) => {
        // Arrange
        const service = serviceWith();

        // Act
        const result = service.filterCollections(text, collections);

        // Assert
        for (const { title } of result) {
          expect(title.toLocaleLowerCase()).toContain(text.toLocaleLowerCase());
        }
      }
    );

    test.prop([fc.string(), fc.array(collectionArb)])(
      'deve devolver um subconjunto da lista original, na mesma ordem',
      (text, collections) => {
        // Arrange
        const service = serviceWith();

        // Act
        const result = service.filterCollections(text, collections);

        // Assert
        let cursor = 0;
        for (const item of result) {
          cursor = collections.indexOf(item, cursor);
          expect(cursor).toBeGreaterThanOrEqual(0);
          cursor += 1;
        }
        expect(result.length).toBeLessThanOrEqual(collections.length);
      }
    );

    test.prop([fc.array(collectionArb)])('deve devolver todas as coleções quando o texto for vazio', collections => {
      // Arrange
      const service = serviceWith();

      // Act
      const result = service.filterCollections('', collections);

      // Assert
      expect(result).toEqual(collections);
    });

    test.prop([fc.string(), fc.string(), fc.string(), collectionArb])(
      'deve incluir toda coleção cujo título tenha o texto buscado no meio',
      (prefix, text, suffix, base) => {
        // Arrange
        const service = serviceWith();
        const target = { ...base, title: `${prefix}${text}${suffix}` };

        // Act
        const result = service.filterCollections(text, [target]);

        // Assert
        expect(result).toEqual([target]);
      }
    );

    test.prop([fc.stringMatching(/^[a-zA-Z]{1,10}$/), fc.string(), collectionArb])(
      'deve encontrar o título independente de maiúsculas e minúsculas na busca',
      (text, prefix, base) => {
        // Arrange
        const service = serviceWith();
        const target = { ...base, title: `${prefix}${text.toUpperCase()}` };

        // Act
        const result = service.filterCollections(text.toLowerCase(), [target]);

        // Assert
        expect(result).toEqual([target]);
      }
    );

    test.prop([fc.string(), fc.array(collectionArb)])('deve ser idempotente: filtrar de novo não muda o resultado', (text, collections) => {
      // Arrange
      const service = serviceWith();
      const once = service.filterCollections(text, collections);

      // Act
      const twice = service.filterCollections(text, once);

      // Assert
      expect(twice).toEqual(once);
    });
  });

  describe('getValidCollections', () => {
    test.prop([fc.array(responseArb)])(
      'deve converter todos os registros do repositório, mantendo ordem e quantidade',
      async records => {
        // Arrange
        const service = serviceWith({ getAll: vi.fn().mockResolvedValue(records) });

        // Act
        const result = await service.getValidCollections();

        // Assert
        expect(result.map(({ id, title, subtitle, author }) => ({ id, title, subtitle, author }))).toEqual(
          records.map(({ id, titulo, subtitulo, autor }) => ({
            id,
            title: titulo,
            subtitle: subtitulo,
            author: autor,
          }))
        );
        expect(result.map(({ image }) => image.url)).toEqual(records.map(({ imagem }) => imagem));
      }
    );
  });

  describe('isValidCollection', () => {
    test.prop([
      fc.record(
        {
          title: fc.string({ minLength: 1 }),
          subtitle: fc.string({ minLength: 1 }),
          author: fc.string({ minLength: 1 }),
          image: fc.webUrl(),
        },
        { requiredKeys: [] }
      ),
      fc.constantFrom('title', 'subtitle', 'author', 'image'),
    ])('deve rejeitar quando qualquer campo obrigatório estiver ausente ou vazio', (fields, missing) => {
      // Arrange
      const service = serviceWith();
      const partial = { ...fields, [missing]: undefined };

      // Act
      const result = service.isValidCollection(partial);

      // Assert
      expect(result).toBe(false);
    });
  });
});
