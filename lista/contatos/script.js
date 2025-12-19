const K='contacts_v1';
const f=document.getElementById('f'), nameIn=document.getElementById('name'), phoneIn=document.getElementById('phone'), emailIn=document.getElementById('email'), list=document.getElementById('list'), clearBtn=document.getElementById('clear');
let items=JSON.parse(localStorage.getItem(K)||'[]');
function save(){localStorage.setItem(K,JSON.stringify(items)); render();}
function render(){list.innerHTML = items.map((c,i)=>`<li data-i="${i}"><div><strong>${esc(c.name)}</strong><div>${esc(c.phone)} ${c.email? '• '+esc(c.email): ''}</div></div><div><button class="e">Editar</button><button class="d">Excluir</button></div></li>`).join('')}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;')}
f.addEventListener('submit',e=>{e.preventDefault(); const obj={name:nameIn.value.trim(),phone:phoneIn.value.trim(),email:emailIn.value.trim()}; const edit = f.dataset.edit; if(edit==null){items.push(obj)}else{items[edit]=obj; delete f.dataset.edit;} nameIn.value=phoneIn.value=emailIn.value=''; save();});
list.addEventListener('click',e=>{const li=e.target.closest('li'); if(!li) return; const i=Number(li.dataset.i); if(e.target.classList.contains('d')){ if(confirm('Excluir?')){items.splice(i,1); save()}} if(e.target.classList.contains('e')){ const c=items[i]; nameIn.value=c.name; phoneIn.value=c.phone; emailIn.value=c.email; f.dataset.edit=i; nameIn.focus();}})
clearBtn.addEventListener('click',()=>{ if(confirm('Limpar todos?')){items=[]; save()}})
render();