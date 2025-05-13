let display = document.getElementById("display");
let judul = document.getElementById("judul");
let db;

window.onload = () => {
  openDB();
  loadHistory();

  document.getElementById("toggleTheme").onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  };

  // Load theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
};

function press(val) {
  display.value += val;
}

function calculate() {
  try {
    const result = eval(display.value);
    saveHistory(judul.value, display.value, result);
    display.value = result;
    judul.value = "";
  } catch {
    alert("Ekspresi tidak valid");
  }
}

function clearDisplay() {
  display.value = "";
}

function openDB() {
  let request = indexedDB.open("kalkulatorDB", 1);
  request.onerror = () => console.error("DB gagal dibuka");
  request.onsuccess = (e) => {
    db = e.target.result;
    loadHistory();
  };
  request.onupgradeneeded = (e) => {
    db = e.target.result;
    db.createObjectStore("history", { keyPath: "id", autoIncrement: true });
  };
}

function saveHistory(title, ekspresi, hasil) {
  if (!db) return;
  let tx = db.transaction("history", "readwrite");
  let store = tx.objectStore("history");
  store.add({
    title,
    ekspresi,
    hasil,
    timestamp: new Date().toISOString()
  });
  tx.oncomplete = loadHistory;
}

function loadHistory() {
  if (!db) return;
  let list = document.getElementById("historyList");
  list.innerHTML = "";
  let tx = db.transaction("history", "readonly");
  let store = tx.objectStore("history");
  store.openCursor().onsuccess = (e) => {
    let cursor = e.target.result;
    if (cursor) {
      let data = cursor.value;
      let li = document.createElement("li");
      li.textContent = `[${data.title}] ${data.ekspresi} = ${data.hasil} (${new Date(data.timestamp).toLocaleString()})`;
      list.appendChild(li);
      cursor.continue();
    }
  };
}

function filterHistory() {
  let query = document.getElementById("search").value.toLowerCase();
  let date = document.getElementById("dateFilter").value;
  let list = document.getElementById("historyList");
  Array.from(list.children).forEach(li => {
    let matchText = li.textContent.toLowerCase();
    let show = matchText.includes(query) && (!date || matchText.includes(date));
    li.style.display = show ? "block" : "none";
  });
}

function clearAllHistory() {
  if (!db) return;
  let tx = db.transaction("history", "readwrite");
  tx.objectStore("history").clear();
  tx.oncomplete = loadHistory;
}
