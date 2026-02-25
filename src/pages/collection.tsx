import CollectionContainer from '../containers/collection';
import { CollectionService } from '../service/collection';
import { CollectionRepository } from '../repository/collection';

function Collection() {
  const repository = new CollectionRepository();
  const collectionService = new CollectionService(repository);

  return <CollectionContainer collectionService={collectionService} />;
}

export default Collection;
