import { Album } from 'src/modules/album/entities/album.entity';
import { Artist } from 'src/modules/artist/entities/artist.entity';
import { Track } from 'src/modules/track/entities/track.entity';
import { User } from 'src/modules/user/entities/user.entity';

export type CollectionTypes = (User | Track | Album | Artist) & {
  id?: string;
};

export class InMemoryMapDB {
  collections: Map<string, Map<string, CollectionTypes>>;
  constructor() {
    this.collections = new Map();
  }

  createCollection(collectionName: string) {
    if (!this.collections.has(collectionName)) {
      this.collections.set(collectionName, new Map());
    }
    return this;
  }

  insert<T extends CollectionTypes>(
    collectionName: string,
    data: T,
    id: string,
  ): CollectionTypes {
    if (!this.collections.has(collectionName)) {
      this.createCollection(collectionName);
    }

    const collection = this.collections.get(collectionName);
    const record = { ...data, id };

    collection!.set(id, record);
    return this.collections.get(collectionName).get(id);
  }
  findById(
    collectionName: string,
    id: string,
    callbackErr: () => void,
  ): CollectionTypes | null {
    const getCollection = this.collections.get(collectionName)?.get(id) || null;
    if (getCollection !== null) {
      return getCollection;
    } else {
      callbackErr();
    }
  }
  getAll(collectionName: string) {
    const collection = this.collections.get(collectionName);
    return collection ? Array.from(collection.values()) : [];
  }
  update<T extends CollectionTypes>(
    collectionName: string,
    id: string,
    transformData: (data: CollectionTypes) => Partial<T>,
    errCallback: () => void,
  ) {
    const collection = this.collections.get(collectionName);
    if (!collection?.has(id)) return errCallback();

    const oldData = collection.get(id);
    const newData = transformData(oldData);
    collection.set(id, { ...newData } as T);
    return this.collections.get(collectionName).get(id);
  }

  find<T extends CollectionTypes>(
    collectionName: string,
    query: Omit<T, 'id'>,
  ) {
    const getCollection = this.getAll(collectionName);

    const getQuery = Object.entries(query);

    const findByQuery = getCollection.filter((elem) => {
      return getQuery.every(
        ([queryKey, queryVal]) =>
          elem.hasOwnProperty(queryKey) &&
          queryVal === elem[queryKey as keyof typeof elem],
      );
    });
    return findByQuery;
  }

  delete(collectionName: string, id: string) {
    return this.collections.get(collectionName)?.delete(id) || false;
  }
  dropCollection(collectionName: string) {
    return this.collections.delete(collectionName);
  }
}
