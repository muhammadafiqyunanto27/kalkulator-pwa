const dbPromise = idb.openDB('calc-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('history')) {
      db.createObjectStore('history', { keyPath: 'timestamp' });
    }
  }
});
