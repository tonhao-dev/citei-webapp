import api from '@/service/api';
import type {
  IServiceCollection,
  IServiceCollectionBody,
  IServiceCollectionResponse,
} from '@/interfaces/collection';

export interface ICollectionRepository {
  getAll: () => Promise<IServiceCollectionResponse[]>;
  saveOne: (collection: IServiceCollectionBody) => Promise<IServiceCollectionResponse>;
}

export class CollectionRepository implements ICollectionRepository {
  public async getAll() {
    const { data } = await api.get<IServiceCollection[]>('/colecao');

    return data.map(
      (item): IServiceCollectionResponse => ({
        id: item.colecao_id,
        titulo: item.colecao_titulo,
        subtitulo: item.colecao_subtitulo ?? '',
        imagem: item.colecao_imagem,
        autor: item.colecao_autor,
        created_at: item.created_at,
      })
    );
  }

  public async saveOne(collection: IServiceCollectionBody) {
    const { data } = await api.post<IServiceCollectionResponse>('/colecao', collection);

    return { ...data, subtitulo: data.subtitulo ?? '' };
  }
}
