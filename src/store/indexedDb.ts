import { IHasId } from "../types/scribbles";

const dbName = "scribblesDb";
const dbVersion = 1;

export interface IObjectStoreIndex {
  name: string;
  keyPath: string;
  options?: { unique?: boolean };
}

export interface IObjectStore {
  name: string;
  options: { keyPath: string; autoIncrement?: boolean };
  indexes?: IObjectStoreIndex[];
}

export const initDb = (stores: IObjectStore[]) => {
  if (!window.indexedDB) {
    // indexedDB is not supported
    return;
  }
  return new Promise<void>((resolve, reject) => {
    const request = window.indexedDB.open(dbName, dbVersion);
    request.onsuccess = (event: any) => {
      event.target.result.close();
      resolve();
    };
    request.onerror = (event: any) => {
      reject(event.target.error);
    };
    request.onupgradeneeded = (event: any) => {
      const database: IDBDatabase = (event.target as any).result;
      stores.forEach((storeSchema) => {
        if (!database.objectStoreNames.contains(storeSchema.name)) {
          const objectStore = database.createObjectStore(
            storeSchema.name,
            storeSchema.options
          );
          storeSchema.indexes?.forEach((schema) => {
            objectStore.createIndex(
              schema.name,
              schema.keyPath,
              schema.options
            );
          });
        }
      });
      database.close();
    };
  });
};

const getObjectStore = async (storeName: string) => {
  return new Promise<[IDBObjectStore, () => void]>((resolve, reject) => {
    const request = window.indexedDB.open(dbName, dbVersion);
    request.onsuccess = (event: any) => {
      const database: IDBDatabase = event.target.result;
      const transaction = database.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);
      resolve([objectStore, database.close.bind(database)]);
    };
    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
};

const addData = async <TData extends IHasId>(
  storeName: string,
  data: TData
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    getObjectStore(storeName).then(([objectStore, closeDatabase]) => {
      const addRequest = objectStore.add(data);
      addRequest.onsuccess = () => {
        closeDatabase();
        resolve();
      };
      addRequest.onerror = (event: any) => {
        closeDatabase();
        reject(event.target.error);
      };
    });
  });
};

const getDataById = async <TData extends IHasId = any>(
  storeName: string,
  id: string
): Promise<TData> => {
  return new Promise((resolve, reject) => {
    getObjectStore(storeName).then(([objectStore, closeDatabase]) => {
      const getRequest = objectStore.get(id);
      getRequest.onsuccess = (event: any) => {
        const data = event.target.result;
        closeDatabase();
        resolve(data);
      };
      getRequest.onerror = (event: any) => {
        closeDatabase();
        reject(event.target.error);
      };
    });
  });
};

const getDataAll = async <TData extends IHasId = any>(
  storeName: string
): Promise<TData[]> => {
  return new Promise((resolve, reject) => {
    getObjectStore(storeName).then(([objectStore, closeDatabase]) => {
      const getRequest = objectStore.getAll();
      getRequest.onsuccess = (event: any) => {
        const data = event.target.result;
        closeDatabase();
        resolve(data);
      };
      getRequest.onerror = (event: any) => {
        closeDatabase();
        reject(event.target.error);
      };
    });
  });
};

const updateData = async <TData extends IHasId>(
  storeName: string,
  data: TData
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    getObjectStore(storeName).then(([objectStore, closeDatabase]) => {
      const updateRequest = objectStore.put(data);
      updateRequest.onsuccess = () => {
        closeDatabase();
        resolve();
      };
      updateRequest.onerror = (event: any) => {
        closeDatabase();
        reject(event.target.error);
      };
    });
  });
};

const deleteData = async (storeName: string, id: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    getObjectStore(storeName).then(([objectStore, closeDatabase]) => {
      const deleteRequest = objectStore.delete(id);
      deleteRequest.onsuccess = () => {
        closeDatabase();
        resolve();
      };
      deleteRequest.onerror = (event: any) => {
        closeDatabase();
        reject(event.target.error);
      };
    });
  });
};

const clearData = async (storeName: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    getObjectStore(storeName).then(([objectStore, closeDatabase]) => {
      const clearRequest = objectStore.clear();
      clearRequest.onsuccess = () => {
        closeDatabase();
        resolve();
      };
      clearRequest.onerror = (event: any) => {
        closeDatabase();
        reject(event.target.error);
      };
    });
  });
};

export const getStore = (storeName: string) => {
  if (!window.indexedDB) {
    // indexedDB is not supported
    return;
  }
  return {
    add: async <TData extends IHasId>(data: TData) => {
      return addData(storeName, data);
    },
    get: async <TData extends IHasId>(id: string): Promise<TData> => {
      return getDataById(storeName, id);
    },
    getAll: async <TData extends IHasId>(): Promise<TData[]> => {
      return getDataAll(storeName);
    },
    update: async <TData extends IHasId>(data: TData): Promise<void> => {
      return updateData(storeName, data);
    },
    delete: async (id: string): Promise<void> => {
      return deleteData(storeName, id);
    },
    clear: async (): Promise<void> => {
      return clearData(storeName);
    },
  };
};
