const form = document.getElementById('form');
const driverInput = document.getElementById('driver');
const timeInput = document.getElementById('time');
const listEl = document.getElementById('list');
const startBtn = document.getElementById('startBtn');
const clearBtn = document.getElementById('clearBtn');

const queue = []; // {driver, time, t}

function render(){
  listEl.innerHTML = queue.map(p => `<li>${escapeHtml(p.driver)} — ${p.time.toFixed(3)} s</li>`).join('');
}

function addDriver(name, time){
  queue.push({driver: name, time: Number(time), t: Date.now()});
  queue.sort((a,b) => a.time - b.time || a.t - b.t);
  render();
}

function popPole(){
  if(queue.length===0) return null;
  const p = queue.shift(); render(); return p;
}

form.addEventListener('submit', e=>{
  e.preventDefault();
  const name = driverInput.value.trim(); const time = timeInput.value;
  if(!name || !time) return;
  addDriver(name, time);
  driverInput.value=''; timeInput.value=''; driverInput.focus();
});

startBtn.addEventListener('click', ()=>{
  const p = popPole();
  if(p) alert(`Pole position: ${p.driver} — ${p.time.toFixed(3)} s`);
  else alert('Nenhum piloto na lista');
});

clearBtn.addEventListener('click', ()=>{ if(confirm('Limpar lista?')){ queue.length=0; render(); } });

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

render();