const DATA_URL = 'data/site.json';
const icons = {forro:'▱',sanca:'✦',drywall:'▥',led:'☼',nicho:'◇',reparo:'⌁','sanca-fechada':'◌',comercio:'▤'};

function waLink(message='Olá! Gostaria de solicitar um orçamento para um serviço de gesso ou drywall.') {
  const phone = window.SITE?.empresa?.whatsapp || '5511976983978';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
function setWhatsApp(message) {
  document.querySelectorAll('.js-wa').forEach(a => { a.href = waLink(message); });
}
function getYTthumb(url){
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([^&?/]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}
function renderHome(data) {
  window.SITE = data;
  const h=data.hero||{};
  const e=document.querySelector('#hero-eyebrow'), t=document.querySelector('#hero-title'), tx=document.querySelector('#hero-text');
  if(e)e.textContent=h.eyebrow||''; if(t)t.textContent=h.title||''; if(tx)tx.textContent=h.text||'';
  const sg=document.querySelector('#services-grid');
  if(sg) sg.innerHTML=(data.services||[]).map(([key,title,desc,tag])=>`<article class="card"><div class="icon">${icons[key]||'✦'}</div>${tag?`<span class="tag">${tag}</span>`:''}<h3>${title}</h3><p>${desc}</p></article>`).join('');
  
  const pg=document.querySelector('#portfolio-grid');
  if(pg){
    pg.innerHTML=(data.portfolio||[]).map(p=>{
      const isVideoUrl = p.tipo==='video-url' && p.url;
      const plataforma = (p.plataforma||'').toLowerCase() || (p.url||'').toLowerCase();
      const isTikTok = plataforma.includes('tiktok');
      const isYT = plataforma.includes('youtu');
      const isInsta = plataforma.includes('instagram');
      const isFace = plataforma.includes('facebook');
      
      let media = '';
      let badge = p.categoria || 'Foto';
      let linkTag = 'div';
      let linkAttr = '';
      
      if(isVideoUrl){
        linkTag = 'a';
        linkAttr = `href="${p.url}" target="_blank" rel="noopener"`;
        if(isTikTok){
          media = `<div style="width:100%;aspect-ratio:4/3;background:#000;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px"><div style="font-size:36px">🎵</div><div style="font-size:11px;font-weight:800;text-align:center">TikTok<br>@belartgesso347<br><span style="background:#fff;color:#000;padding:4px 10px;border-radius:99px;margin-top:6px;display:inline-block">▶ Ver vídeo</span></div></div>`;
          badge = 'TikTok';
        }else if(isYT){
          const thumb = getYTthumb(p.url);
          media = thumb ? `<img src="${thumb}" alt="${p.titulo}" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover"><div style="position:absolute;inset:0;display:grid;place-items:center"><span style="width:52px;height:52px;background:rgba(255,255,255,.92);border-radius:50%;display:grid;place-items:center">▶</span></div>` : `<div style="width:100%;aspect-ratio:4/3;background:#ff0000;color:#fff;display:grid;place-items:center">▶ YouTube</div>`;
          badge = 'YouTube';
        }else if(isInsta){
          media = `<div style="width:100%;aspect-ratio:4/3;background:linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5);color:#fff;display:grid;place-items:center">📸 Reels</div>`;
          badge = 'Instagram';
        }else if(isFace){
          media = `<div style="width:100%;aspect-ratio:4/3;background:#1877f2;color:#fff;display:grid;place-items:center">👍 Facebook</div>`;
          badge = 'Facebook';
        }else{
          media = `<div style="width:100%;aspect-ratio:4/3;background:#111827;color:#fff;display:grid;place-items:center">🔗 Vídeo</div>`;
          badge = 'Vídeo';
        }
      }else{
        // foto normal
        const src = p.arquivo ? `imagens/${p.arquivo}` : '';
        media = src ? `<img src="${src}" alt="${p.titulo} — ${p.cidade}" loading="lazy" onerror="this.style.display='none'">` : `<div style="width:100%;aspect-ratio:4/3;background:#f6f7f9;display:grid;place-items:center">🏠</div>`;
        badge = p.categoria || 'Foto';
      }
      
      return `<${linkTag} ${linkAttr} class="portfolio-item" data-cat="${p.categoria}" data-city="${p.cidade}" style="position:relative;text-decoration:none;color:inherit"><div style="position:absolute;top:10px;left:10px;z-index:3;padding:4px 8px;border-radius:99px;font-size:10px;font-weight:800;text-transform:uppercase;background:${isTikTok?'#000':isYT?'#ff0000':'rgba(0,0,0,.8)'};color:#fff">${badge}</div>${media}<div class="pbody"><strong>${p.titulo}</strong><small>${p.categoria} • ${p.cidade}</small></div></${linkTag}>`;
    }).join('');
  }
  
  const rg=document.querySelector('#reviews-grid');
  if(rg) rg.innerHTML=(data.reviews||[]).map(r=>`<article class="review"><p>“${r[1]}”</p><strong>${r[0]}</strong></article>`).join('');
  const fq=document.querySelector('#faq-list');
  if(fq) fq.innerHTML=(data.faq||[]).map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('');
  const filters=document.querySelector('#filters');
  if(filters){
    const cats=['Todos','Forros','Antes e Depois','Iluminação','Drywall','Sancas'];
    const cities=(data.areas||[]);
    filters.innerHTML=[...cats,...cities].map((x,i)=>`<button class="filter ${i===0?'active':''}" data-filter="${x}">${x}</button>`).join('');
    filters.addEventListener('click',ev=>{
      const b=ev.target.closest('.filter'); if(!b)return;
      filters.querySelectorAll('.filter').forEach(x=>x.classList.remove('active')); b.classList.add('active');
      const val=b.dataset.filter;
      document.querySelectorAll('.portfolio-item').forEach(card=>{
        card.hidden=!(val==='Todos'||card.dataset.cat===val||card.dataset.city===val);
      });
    });
  }
  setWhatsApp('Olá! Vi o site da BelartGesso e gostaria de pedir um orçamento. Posso enviar fotos e informações do ambiente?');
  const year=document.querySelector('#year'); if(year) year.textContent=new Date().getFullYear();
  const schema=document.querySelector('#schema');
  if(schema){
    schema.textContent=JSON.stringify({
      '@context':'https://schema.org','@type':'HomeAndConstructionBusiness','name':data.empresa.nome,
      'url':data.empresa.url,'logo':new URL(data.empresa.logo, location.href).href,'telephone':`+${data.empresa.telefone}`,'areaServed':data.areas.map(a=>({'@type':'City','name':a})),
      'hasOfferCatalog':{'@type':'OfferCatalog','name':'Serviços de gesso e drywall','itemListElement':data.services.map((s,i)=>({'@type':'Offer','position':i+1,'itemOffered':{'@type':'Service','name':s[1],'description':s[2]}}))}
    });
  }
}
function setupMenu(){
  const b=document.querySelector('.menu-toggle'), n=document.querySelector('#main-nav');
  if(b&&n)b.addEventListener('click',()=>{const open=n.classList.toggle('open');b.setAttribute('aria-expanded',open);});
}
function setupQuoteForm(){
  const f=document.querySelector('#quote-form'); if(!f)return;
  f.addEventListener('submit',e=>{
    e.preventDefault();
    const fd=new FormData(f);
    const msg=`Olá! Gostaria de solicitar um orçamento com a BelartGesso.%0A%0ANome: ${fd.get('nome')||''}%0ACidade: ${fd.get('cidade')||''}%0AServiço: ${fd.get('servico')||''}%0AAmbiente: ${fd.get('ambiente')||''}%0ADetalhes: ${fd.get('detalhes')||''}%0A%0APosso enviar fotos do ambiente por aqui.`;
    window.open(`https://wa.me/${window.SITE?.empresa?.whatsapp||'5511976983978'}?text=${msg}`,'_blank','noopener');
  });
}
async function boot(){
  setupMenu();
  try{ 
    const r=await fetch(DATA_URL+'?v='+Date.now()); 
    const data=await r.json(); 
    renderHome(data); 
    setupQuoteForm(); 
  }
  catch(err){ console.error(err); setWhatsApp(); setupQuoteForm(); }
}
boot();
