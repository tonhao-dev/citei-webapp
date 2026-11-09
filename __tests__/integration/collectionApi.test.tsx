import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import api from '../../src/service/api';
import Collection from '../../src/containers/collection';
import { CollectionRepository } from '../../src/repository/collection';
import { CollectionService } from '../../src/service/collection';

// Integração: container + service + repository + axios reais.
// Só a rede é falsa: um adapter do axios responde no lugar da API.

type Call = { method?: string; url?: string; data?: unknown };

const apiRow = {
  colecao_id: 1,
  colecao_titulo: 'Stoicismo',
  colecao_subtitulo: null,
  colecao_imagem: 'http://localhost:5173/assets/collection.jpg',
  colecao_autor: 'Seneca',
  created_at: '2026-01-01T00:00:00.000Z',
};

let calls: Call[];
let originalAdapter: typeof api.defaults.adapter;

function fakeApi(responses: Record<string, unknown>): AxiosAdapter {
  return async (config: InternalAxiosRequestConfig) => {
    const call: Call = {
      method: config.method,
      url: config.url,
      data: config.data ? JSON.parse(config.data) : undefined,
    };
    calls.push(call);
    return {
      data: responses[`${config.method} ${config.url}`],
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  };
}

async function renderContainer() {
  const service = new CollectionService(new CollectionRepository());
  await act(async () => render(<Collection collectionService={service} />));
}

beforeEach(() => {
  // Arrange
  calls = [];
  originalAdapter = api.defaults.adapter;
  vi.spyOn(window, 'alert').mockImplementation(() => undefined);
});

afterEach(() => {
  // Teardown
  cleanup();
  api.defaults.adapter = originalAdapter;
  vi.restoreAllMocks();
});

describe('/containers/collection com repository e service reais', () => {
  it('deve buscar as coleções em GET /colecao e exibir o título delas', async () => {
    // Arrange
    api.defaults.adapter = fakeApi({ 'get /colecao': [apiRow] });

    // Act
    await renderContainer();

    // Assert
    expect(calls).toEqual([{ method: 'get', url: '/colecao', data: undefined }]);
    expect(screen.getByText('Stoicismo')).toBeInTheDocument();
    expect(screen.getByText('Seneca')).toBeInTheDocument();
  });

  it('deve enviar POST /colecao com os campos do formulário e exibir a nova coleção', async () => {
    // Arrange
    api.defaults.adapter = fakeApi({
      'get /colecao': [],
      'post /colecao': { ...apiRow, id: 7, titulo: 'Nova', subtitulo: 'Sub', autor: 'Eu', imagem: apiRow.colecao_imagem },
    });
    await renderContainer();
    await userEvent.click(screen.getByText('Adicionar coleção'));
    await userEvent.type(screen.getByPlaceholderText('Título da coleção'), 'Nova');
    await userEvent.type(screen.getByPlaceholderText('Subtítulo da coleção'), 'Sub');
    await userEvent.type(screen.getByPlaceholderText('Link para imagem de capa'), apiRow.colecao_imagem);
    await userEvent.type(screen.getByPlaceholderText('Autor da coleção'), 'Eu');

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    // Assert
    expect(calls[1]).toEqual({
      method: 'post',
      url: '/colecao',
      data: { titulo: 'Nova', subtitulo: 'Sub', autor: 'Eu', imagem: apiRow.colecao_imagem },
    });
    expect(await screen.findByText('Nova')).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('não deve chamar a API quando o formulário estiver incompleto', async () => {
    // Arrange
    api.defaults.adapter = fakeApi({ 'get /colecao': [] });
    await renderContainer();
    await userEvent.click(screen.getByText('Adicionar coleção'));
    await userEvent.type(screen.getByPlaceholderText('Título da coleção'), 'Só o título');

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    // Assert
    expect(calls.map(({ method }) => method)).toEqual(['get']);
    expect(window.alert).toHaveBeenCalledTimes(1);
  });

  it('deve filtrar a lista pelo texto digitado na busca, sem chamar a API de novo', async () => {
    // Arrange
    api.defaults.adapter = fakeApi({
      'get /colecao': [apiRow, { ...apiRow, colecao_id: 2, colecao_titulo: 'Epicurismo' }],
    });
    await renderContainer();
    await userEvent.click(screen.getByLabelText('search-icon'));

    // Act
    await userEvent.type(screen.getByRole('textbox'), 'epic');

    // Assert
    expect(screen.queryByText('Stoicismo')).not.toBeInTheDocument();
    expect(screen.getByText('Epicurismo')).toBeInTheDocument();
    expect(calls).toHaveLength(1);
  });
});
