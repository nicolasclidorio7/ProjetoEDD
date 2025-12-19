// Fila de prioridade simples: menor número = maior prioridade
const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const prioritySel = document.getElementById('priority');
const listEl = document.getElementById('list');
const nextBtn = document.getElementById('nextBtn');
const clearBtn = document.getElementById('clearBtn');

const queue = []; // {name, priority, time}

function render(){
  listEl.innerHTML = queue.map((p,i) => `<li><strong>#${i+1}</strong> ${escapeHtml(p.name)} — prioridade ${p.priority}</li>`).join('');
}

function enqueue(name, priority){
  queue.push({name, priority: Number(priority), time: Date.now()});
  queue.sort((a,b) => a.priority - b.priority || a.time - b.time);
  render();
}

function dequeue(){
  if(queue.length===0) return null;
  const next = queue.shift(); render(); return next;
}

form.addEventListener('submit', e=>{
  e.preventDefault();
  const name = nameInput.value.trim(); if(!name) return;
  enqueue(name, prioritySel.value);
  nameInput.value=''; nameInput.focus();
});

nextBtn.addEventListener('click', ()=>{
  const p = dequeue();
  if(p) alert(`Atendendo: ${p.name} (prioridade ${p.priority})`);
  else alert('Fila vazia');
});

clearBtn.addEventListener('click', ()=>{ if(confirm('Limpar fila?')){ queue.length=0; render(); } });

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

render();