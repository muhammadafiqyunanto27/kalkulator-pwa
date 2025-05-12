let db;

const request = indexedDB.open('KalkulatorDB', 1);

request.onerror = () => {
  console.error("Gagal membuka IndexedDB");
};

request.onsuccess = (event) => {
  db = event.target.result;
  loadCalculations();
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

  tx.oncomplete = () => {
    loadCalculations();
  };
}

function loadCalculations() {
  if (!db) return;

  const tx = db.transaction('calculations', 'readonly');
  const store = tx.objectStore('calculations');
  const request = store.getAll();

  request.onsuccess = () => {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    request.result.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.title} = ${entry.result} (${new Date(entry.timestamp).toLocaleString()})`;
      historyList.appendChild(li);
    });
  };
}
