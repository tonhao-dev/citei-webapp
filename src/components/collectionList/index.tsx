import styles from './styles.module.css';
import type { ICollection } from '@/interfaces/collection';
import Collection from '../collection';

interface ICollectionListProps {
  collections: ICollection[];
  onEdit?: (collection: ICollection) => void;
  onDelete?: (collection: ICollection) => void;
}

function CollectionList({ collections, onEdit, onDelete }: ICollectionListProps) {
  return (
    <ul className={styles['collection-list']}>
      {collections.map(collection => (
        <Collection
          key={collection.title}
          collection={collection}
          onEdit={() => onEdit && onEdit(collection)}
          onDelete={() => onDelete && onDelete(collection)}
        />
      ))}
    </ul>
  );
}

export default CollectionList;
