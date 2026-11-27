import { test, fc } from '@fast-check/vitest';
import api from '../../src/service/api';
import { CollectionRepository } from '../../src/repository/collection';
import type { IServiceCollection } from '../../src/interfaces/collection';

vi.mock('../../src/service/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

const rowArb = fc.record({
  colecao_id: fc.integer({ min: 1 }),
  colecao_titulo: fc.string(),
  colecao_subtitulo: fc.option(fc.string(), { nil: null }),
  colecao_imagem: fc.string(),
  colecao_autor: fc.string(),
  created_at: fc.constant('2026-01-01T00:00:00.000Z'),
});

describe('repository/collection (propriedades)', () => {
  afterEach(() => {
    // Teardown
    vi.clearAllMocks();
  });

  test.prop([fc.array(rowArb)])(
    'deve mapear todas as linhas da API, mantendo ordem e quantidade',
    async rows => {
      // Arrange
      vi.mocked(api.get).mockResolvedValue({ data: rows });
      const repository = new CollectionRepository();

      // Act
      const result = await repository.getAll();

      // Assert
      expect(result.map(({ id, titulo, autor, imagem }) => ({ id, titulo, autor, imagem }))).toEqual(
        rows.map(row => ({
          id: row.colecao_id,
          titulo: row.colecao_titulo,
          autor: row.colecao_autor,
          imagem: row.colecao_imagem,
        }))
      );
    }
  );

  test.prop([fc.array(rowArb, { minLength: 1 })])(
    'deve devolver sempre um texto no subtítulo, nunca null',
    async (rows: IServiceCollection[]) => {
      // Arrange
      vi.mocked(api.get).mockResolvedValue({ data: rows });
      const repository = new CollectionRepository();

      // Act
      const result = await repository.getAll();

      // Assert
      for (const [index, item] of result.entries()) {
        expect(item.subtitulo).toBe(rows[index].colecao_subtitulo ?? '');
      }
    }
  );
});
