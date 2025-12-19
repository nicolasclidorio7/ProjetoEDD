class Stack{
  constructor(){this.a=[]}
  push(v){this.a.push(v)}
  pop(){return this.a.pop()}
  peek(){return this.a[this.a.length-1]}
  isEmpty(){return this.a.length===0}
  toArray(){return this.a.slice()}
  clear(){this.a.length=0}
}

const numInput = document.getElementById('numInput');
const convertBtn = document.getElementById('convertBtn');
const stepBtn = document.getElementById('stepBtn');
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('resetBtn');
const stackDiv = document.getElementById('stack');
const resultDiv = document.getElementById('result');

let steps = []; // cada passo: {type:'push'|'pop', value:number, stackSnapshot:[]}
let stepIndex = 0;
let playTimer = null;

function renderStack(arr){
  stackDiv.innerHTML = '';
  const data = arr.slice().reverse(); // queremos topo em cima
  data.forEach(v=>{
    const d = document.createElement('div'); d.className='item'; d.textContent = v; stackDiv.appendChild(d);
  })
}

function buildStepsFromNumber(n){
  steps = [];
  const s = new Stack();
  if(n===0){ steps.push({type:'push',value:0,stackSnapshot:[0]}); steps.push({type:'pop',value:0,stackSnapshot:[]}); return; }
  let x = n;
  while(x>0){
    const r = x%2; x = Math.floor(x/2);
    s.push(r);
    steps.push({type:'push',value:r,stackSnapshot:s.toArray().slice().reverse()});
  }
  // agora pops para formar o binario
  const tmp = s.toArray().slice();
  while(tmp.length>0){
    const v = tmp.pop();
    steps.push({type:'pop',value:v,stackSnapshot:tmp.slice().reverse()});
  }
}

function applyStep(i){
  const step = steps[i];
  renderStack(step.stackSnapshot);
  // Calcular resultado até i: concat de todos pops até i (ordem de ocorrência)
  let bin = '';
  for(let j=0;j<=i;j++) if(steps[j].type==='pop') bin += steps[j].value;
  resultDiv.textContent = bin || '—';
}

convertBtn.addEventListener('click', ()=>{
  const v = Number(numInput.value);
  if(!Number.isInteger(v) || v<0){ alert('Digite um inteiro não-negativo.'); return; }
  buildStepsFromNumber(v);
  stepIndex = 0;
  applyStep(0);
  stepBtn.disabled = false; playBtn.disabled = false;
});

stepBtn.addEventListener('click', ()=>{
  stepIndex = Math.min(stepIndex+1, steps.length-1);
  applyStep(stepIndex);
  if(stepIndex===steps.length-1) stepBtn.disabled = true;
});

playBtn.addEventListener('click', ()=>{
  if(playTimer){ clearInterval(playTimer); playTimer=null; playBtn.textContent='Play'; return; }
  playBtn.textContent='Pause';
  stepBtn.disabled = true;
  playTimer = setInterval(()=>{
    if(stepIndex<steps.length-1){ stepIndex++; applyStep(stepIndex); }
    else{ clearInterval(playTimer); playTimer=null; playBtn.textContent='Play'; stepBtn.disabled=true; }
  }, 500);
});

resetBtn.addEventListener('click', ()=>{
  if(playTimer){ clearInterval(playTimer); playTimer=null; playBtn.textContent='Play'; }
  steps = []; stepIndex=0; renderStack([]); resultDiv.textContent='—'; stepBtn.disabled=true; playBtn.disabled=true; numInput.value='';
});

// initial
renderStack([]);
resultDiv.textContent='—';
