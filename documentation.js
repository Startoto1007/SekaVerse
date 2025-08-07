// js/documentation.js
document.addEventListener("DOMContentLoaded", () => {
  // Starfield canvas init (simple)
  const canvas = document.createElement('canvas');
  canvas.id = 'spaceCanvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
  resize();window.addEventListener('resize', resize);
  const stars=[];
  const num=420;
  for(let i=0;i<num;i++) stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,z:Math.random()*canvas.width});
  function step(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // subtle gradient
    const g=ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0,'#030014');g.addColorStop(1,'#050011');
    ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let s of stars){
      s.z-=6;
      if(s.z<=0){s.x=Math.random()*canvas.width;s.y=Math.random()*canvas.height;s.z=canvas.width}
      const k=128/s.z;
      const x=s.x*k+canvas.width/2;
      const y=s.y*k+canvas.height/2;
      const size=(1-s.z/canvas.width)*3;
      ctx.beginPath();ctx.fillStyle='white';ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  // Documentation loader
  const docContainer = document.getElementById('documentation-container');
  if(!docContainer) return;
  const botName = docContainer.dataset.bot;
  fetch(`documentation/${botName}.json`)
    .then(r=>{
      if(!r.ok) throw new Error('Failed to load JSON');
      return r.json();
    })
    .then(data=>{
      renderDocumentation(data, docContainer);
    })
    .catch(err=>{
      docContainer.innerHTML = '<p>Impossible de charger la documentation.</p>';
      console.error(err);
    });

  function renderDocumentation(data, root){
    // categories can be defined in data.categories
    const cats = data.categories || {};
    // optional: render categories order if provided
    for(const catName of Object.keys(cats)){
      const h3 = document.createElement('h3');
      h3.textContent = catName;
      h3.style.color = '#ffcc99';
      root.appendChild(h3);
      const list = cats[catName];
      for(const cmd of list){
        const c = document.createElement('div');
        c.className = 'command-card';
        c.innerHTML = `<h4>${escapeHtml(cmd.name)}</h4>
          ${cmd.image? `<img src="${cmd.image}" style="max-width:160px;border-radius:8px;margin-bottom:8px">`:''}
          ${cmd.description? `<p><strong>Description:</strong> ${escapeHtml(cmd.description)}</p>`:''}
          <p><strong>Fonctionnement:</strong> ${escapeHtml(cmd.howto || '—')}</p>
          ${cmd.usage? `<p><strong>Usage:</strong> <code>${escapeHtml(cmd.usage)}</code></p>`:''}
        `;
        root.appendChild(c);
      }
    }
  }

  function escapeHtml(s){
    if(!s) return '';
    return String(s).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]});
  }
});
