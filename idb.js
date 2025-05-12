let db;

const request = indexedDB.open('KalkulatorDB', 1);

request.onerror = () => {
  console.error("Gagal membuka IndexedDB");
};

request.onsuccess = (event) => {
  db = event.target.result;
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains('calculations')) {
    db.createObjectStore('calculations', { keyPath: 'id', autoIncrement: true });
  }
};

function saveCalculation(title, result) {
  if (!db) return;

  const tx = db.transaction('calculations', 'readwrite');
  const store = tx.objectStore('calculations');
  store.add({
    title,
    result,
    timestamp: new Date()
  });
}
