import { PactV4, MatchersV3 } from '@pact-foundation/pact';
import path from 'node:path';
import api from '../../src/service/api';
import { CollectionRepository } from '../../src/repository/collection';

const { like, eachLike, integer, string, datetime, regex, nullValue, includes } = MatchersV3;

// Contrato do frontend (consumidor) com o backend (provedor).
// O mock server do Pact responde no lugar da API e grava o contrato em ./pacts.
const provider = new PactV4({
  consumer: 'citei-webapp',
  provider: 'citei-backend',
  dir: path.resolve(__dirname, '../../pacts'),
  logLevel: 'warn',
});

const jsonHeaders = {
  'Content-Type': regex(/^application\/json.*$/, 'application/json; charset=utf-8'),
};

const collectionBody = {
  titulo: 'Stoicismo',
  subtitulo: 'Frases',
  autor: 'Seneca',
  imagem: 'http://localhost:5173/assets/collection.jpg',
};

describe('contrato citei-webapp -> citei-backend', () => {
  let originalBaseUrl: string | undefined;

  beforeEach(() => {
    // Arrange
    originalBaseUrl = api.defaults.baseURL;
  });

  afterEach(() => {
    // Teardown
    api.defaults.baseURL = originalBaseUrl;
  });

  it('GET /colecao devolve a lista de coleções', async () => {
    // Arrange
    await provider
      .addInteraction()
      .given('existe uma coleção')
      .uponReceiving('uma busca da lista de coleções')
      .withRequest('GET', '/colecao')
      .willRespondWith(200, builder => {
        builder.headers(jsonHeaders).jsonBody(
          eachLike({
            colecao_id: integer(1),
            colecao_titulo: string('Stoicismo'),
            colecao_subtitulo: string('Frases'),
            colecao_imagem: string('http://localhost:5173/assets/collection.jpg'),
            colecao_autor: string('Seneca'),
            created_at: datetime("yyyy-MM-dd'T'HH:mm:ss.SSSX", '2026-01-01T00:00:00.000Z'),
          })
        );
      })
      // Act
      .executeTest(async mockServer => {
        api.defaults.baseURL = mockServer.url;
        const result = await new CollectionRepository().getAll();

        // Assert
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({ id: 1, titulo: 'Stoicismo', autor: 'Seneca' });
      });
  });

  it('GET /colecao devolve lista vazia quando não há coleções', async () => {
    // Arrange
    await provider
      .addInteraction()
      .given('não existem coleções')
      .uponReceiving('uma busca da lista de coleções vazia')
      .withRequest('GET', '/colecao')
      .willRespondWith(200, builder => {
        builder.headers(jsonHeaders).jsonBody([]);
      })
      // Act
      .executeTest(async mockServer => {
        api.defaults.baseURL = mockServer.url;
        const result = await new CollectionRepository().getAll();

        // Assert
        expect(result).toEqual([]);
      });
  });

  it('GET /colecao aceita subtítulo nulo', async () => {
    // Arrange
    await provider
      .addInteraction()
      .given('existe uma coleção sem subtítulo')
      .uponReceiving('uma busca da lista com coleção sem subtítulo')
      .withRequest('GET', '/colecao')
      .willRespondWith(200, builder => {
        builder.headers(jsonHeaders).jsonBody(
          eachLike({
            colecao_id: integer(1),
            colecao_titulo: string('Stoicismo'),
            colecao_subtitulo: nullValue(),
            colecao_imagem: string('http://localhost:5173/assets/collection.jpg'),
            colecao_autor: string('Seneca'),
            created_at: datetime("yyyy-MM-dd'T'HH:mm:ss.SSSX", '2026-01-01T00:00:00.000Z'),
          })
        );
      })
      // Act
      .executeTest(async mockServer => {
        api.defaults.baseURL = mockServer.url;
        const result = await new CollectionRepository().getAll();

        // Assert
        expect(result[0].subtitulo).toBe('');
      });
  });

  it('POST /colecao cria a coleção e devolve o registro com id', async () => {
    // Arrange
    await provider
      .addInteraction()
      .given('não existem coleções')
      .uponReceiving('um pedido para criar uma coleção')
      .withRequest('POST', '/colecao', builder => {
        builder
          .headers({ 'Content-Type': includes('application/json') })
          .jsonBody(collectionBody);
      })
      .willRespondWith(200, builder => {
        builder.headers(jsonHeaders).jsonBody({
          id: integer(1),
          titulo: like(collectionBody.titulo),
          subtitulo: like(collectionBody.subtitulo),
          autor: like(collectionBody.autor),
          imagem: like(collectionBody.imagem),
          created_at: datetime("yyyy-MM-dd'T'HH:mm:ss.SSSX", '2026-01-01T00:00:00.000Z'),
        });
      })
      // Act
      .executeTest(async mockServer => {
        api.defaults.baseURL = mockServer.url;
        const result = await new CollectionRepository().saveOne(collectionBody);

        // Assert
        expect(result).toMatchObject({ id: 1, ...collectionBody });
      });
  });
});
