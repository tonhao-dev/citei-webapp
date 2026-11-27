import { useEffect, useState } from 'react';
import Title from '@/components/title';
import Subtitle from '@/components/subtitle';
import CollectionList from '@/components/collectionList';
import Button from '@/components/button';
import type { ICollection, IRawCollection } from '@/interfaces/collection';
import type { ICollectionService } from '@/service/collection';
import Modal from '@/components/modal';
import Input from '@/components/input';
import Search from '@/components/search';

import styles from './styles.module.css';

export interface ICollectionProps {
  collectionService: ICollectionService;
}

function Collection({ collectionService }: ICollectionProps) {
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [editing, setEditing] = useState<ICollection | null>(null);
  const [newCollection, setNewCollection] = useState<Partial<IRawCollection>>({});

  async function fetch() {
    setCollections(await collectionService.getValidCollections());
  }

  function closeModal() {
    setModalIsOpen(false);
    setEditing(null);
    setNewCollection({});
  }

  function openEdit(collection: ICollection) {
    setEditing(collection);
    setNewCollection({
      title: collection.title,
      subtitle: collection.subtitle,
      author: collection.author,
      image: collection.image.url,
    });
    setModalIsOpen(true);
  }

  async function save() {
    if (!collectionService.isValidCollection(newCollection))
      return window.alert('Erro! revise os campos do modal');

    if (editing) {
      const updated = await collectionService.updateCollection(
        editing.id,
        newCollection as IRawCollection
      );
      setCollections(collections.map(item => (item.id === editing.id ? updated : item)));
    } else {
      const collection = await collectionService.saveCollection(newCollection as IRawCollection);
      setCollections([...collections, collection]);
    }

    closeModal();
  }

  async function remove(collection: ICollection) {
    if (!window.confirm('Deseja excluir esta coleção?')) return;

    await collectionService.deleteCollection(collection.id);
    setCollections(collections.filter(item => item.id !== collection.id));
  }

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className={styles['collection-container']}>
      <header className={styles.heading}>
        <div className={styles.title}>
          {!isSearch && <Title>Citei</Title>}
          <Search onChange={text => setSearch(text)} onToggle={isSearch => setIsSearch(isSearch)} />
        </div>
        {!isSearch && <Subtitle>Coleções, seu conjunto de citações em reunidos em lugar.</Subtitle>}
      </header>

      <CollectionList
        collections={collectionService.filterCollections(search, collections)}
        onEdit={openEdit}
        onDelete={remove}
      />

      <Modal visible={modalIsOpen} onClose={closeModal}>
        <form className={styles.form} onSubmit={e => e.preventDefault()}>
          <Input
            required
            placeholder="Título da coleção"
            value={newCollection.title ?? ''}
            onChange={e => {
              setNewCollection({ ...newCollection, title: e.target.value });
            }}
          />
          <Input
            required
            placeholder="Subtítulo da coleção"
            value={newCollection.subtitle ?? ''}
            onChange={e => {
              setNewCollection({ ...newCollection, subtitle: e.target.value });
            }}
          />
          <Input
            required
            placeholder="Link para imagem de capa"
            value={newCollection.image ?? ''}
            onChange={e => {
              setNewCollection({ ...newCollection, image: e.target.value });
            }}
          />
          <Input
            required
            placeholder="Autor da coleção"
            value={newCollection.author ?? ''}
            onChange={e => {
              setNewCollection({ ...newCollection, author: e.target.value });
            }}
          />

          <Button title="Salvar" variant="black" onClick={() => save()} />
        </form>
      </Modal>

      <Button
        title="Adicionar coleção"
        onClick={() => setModalIsOpen(!modalIsOpen)}
        aria-label="Adicionar coleção"
      />
    </div>
  );
}

export default Collection;
