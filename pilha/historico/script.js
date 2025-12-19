// Simplified history with arrays as stacks and debounced snapshots

const editor = document.getElementById('editor');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const playBtn = document.getElementById('playBtn');
const clearHistoryBtn = document.getElementById('clearHistory');
const eventsDiv = document.getElementById('events');
const countSpan = document.getElementById('count');
const speedRange = document.getElementById('speed');

const undoStack = []; // snapshots in chronological order
const redoStack = [];
let playTimer = null;
let debounceTimer = null;
const DEBOUNCE_MS = 500;

const snapshot = () => ({ text: editor.value, t: Date.now() });

const pushSnapshot = (snap) => {
  const last = undoStack[undoStack.length - 1];
  if (last && last.text === snap.text) return; // evita duplicatas consecutivas
  undoStack.push(snap);
  redoStack.length = 0; // limpa redo
  render();
};

editor.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => pushSnapshot(snapshot()), DEBOUNCE_MS);
});

function render() {
  eventsDiv.innerHTML = undoStack.map(s => `<div class="evt">${new Date(s.t).toLocaleTimeString()}</div>`).join('');
  countSpan.textContent = undoStack.length;
  undoBtn.disabled = undoStack.length <= 1; // manter estado inicial
  redoBtn.disabled = redoStack.length === 0;
}

undoBtn.addEventListener('click', () => {
  if (undoStack.length <= 1) return; // nada a desfazer
  const cur = undoStack.pop();
  redoStack.push(cur);
  editor.value = (undoStack[undoStack.length - 1] || { text: '' }).text;
  render();
});

redoBtn.addEventListener('click', () => {
  if (redoStack.length === 0) return;
  const r = redoStack.pop();
  undoStack.push(r);
  editor.value = r.text;
  render();
});

playBtn.addEventListener('click', () => {
  if (playTimer) { clearInterval(playTimer); playTimer = null; playBtn.textContent = 'Play'; return; }
  const list = undoStack.slice();
  if (!list.length) return;
  playBtn.textContent = 'Pause';
  let i = 0; editor.value = '';
  const interval = Number(speedRange.value);
  playTimer = setInterval(() => {
    if (i >= list.length) { clearInterval(playTimer); playTimer = null; playBtn.textContent = 'Play'; return; }
    editor.value = list[i].text;
    i++;
  }, interval);
});

clearHistoryBtn.addEventListener('click', () => {
  undoStack.length = 0; redoStack.length = 0; editor.value = '';
  pushSnapshot(snapshot());
});

// inicializa com snapshot vazio para comportamento previsível do Undo
pushSnapshot({ text: '', t: Date.now() });
render();
