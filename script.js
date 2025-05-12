let display = document.getElementById('display');
let judulInput = document.getElementById('judul');
let historyList = document.getElementById('historyList');
let searchInput = document.getElementById('search');
let dateInput = document.getElementById('dateFilter');

let db;

const request = indexedDB.open('KalkulatorDB', 1);
request.onerror = () => console.error("Gagal membuka IndexedDB");

request.onsuccess = (event) => {
  db = event.target.result;
  showAllHistory();
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains('calculations')) {
    db.createObjectStore('calculations', { keyPath: 'id', autoIncrement: true });
  }
};

function appendToDisplay(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = '';
  judulInput.value = '';
}

function calculate() {
  try {
    const result = eval(display.value);
    display.value = result;

    const title = judulInput.value || 'Tanpa Judul';
    saveCalculation(title, result);
  } catch {
    display.value = 'Error';
  }
}

function saveCalculation(title, result) {
  if (!db) return;

  const tx = db.transaction('calculations', 'readwrite');
  const store = tx.objectStore('calculations');
  const data = {
    title,
    result,
    timestamp: new Date()
  };
  store.add(data);
  tx.oncomplete = () => showAllHistory();
}

function showAllHistory() {
  const tx = db.transaction('calculations', 'readonly');
  const store = tx.objectStore('calculations');
  const request = store.getAll();

  request.onsuccess = () => {
    renderHistory(request.result);
  };
}

function renderHistory(data) {
  historyList.innerHTML = '';

  const searchQuery = searchInput.value.toLowerCase();
  const dateFilter = dateInput.value;

  data
    .filter(item => {
      const matchTitle = item.title.toLowerCase().includes(searchQuery);
      const matchDate = dateFilter ? new Date(item.timestamp).toISOString().split('T')[0] === dateFilter : true;
      return matchTitle && matchDate;
    })
    .reverse()
    .forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${item.title}</strong>: ${item.result} <br />
        <small>${new Date(item.timestamp).toLocaleString()}</small>
        <button class="delete-btn" onclick="deleteEntry(${item.id})">x</button>
      `;
      historyList.appendChild(li);
    });
}

function filterResults() {
  showAllHistory();
}

function deleteEntry(id) {
  const tx = db.transaction('calculations', 'readwrite');
  const store = tx.objectStore('calculations');
  store.delete(id);
  tx.oncomplete = () => showAllHistory();
}

function clearHistory() {
  const tx = db.transaction('calculations', 'readwrite');
  const store = tx.objectStore('calculations');
  const clearRequest = store.clear();
  clearRequest.onsuccess = () => showAllHistory();
}
