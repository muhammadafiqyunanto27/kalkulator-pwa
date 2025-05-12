let display = document.getElementById('display');
let judulInput = document.getElementById('judul');

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

    // Simpan ke IndexedDB
    const title = judulInput.value || 'Tanpa Judul';
    saveCalculation(title, result);
  } catch {
    display.value = 'Error';
  }
}
