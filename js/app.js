
const DATA_URL = 'data/site.json';
const icons = {forro:'▱',sanca:'✦',drywall:'▥',led:'☼',nicho:'◇',reparo:'⌁','sanca-fechada':'◌',comercio:'▤'};

function waLink(message='Olá! Gostaria de solicitar um orçamento para um serviço de gesso ou drywall.') {
  const phone = window.SITE?.empresa?.whatsapp || '5511976983978';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
function setWhatsApp(message) {
  document.querySelectorAll('.js-wa').forEach(a => { a.href = waLink(message); });
}
function renderHome(data) {
  window.SITE = data;
  const h=data.hero||{};
  const e=document.querySelector('#hero-eyebrow'), t=document.querySelector('#hero-title'), tx=document.querySelector('#hero-text');
  if(e)e.textContent=h.eyebrow||''; if(t)t.textContent=h.title||''; if(tx)tx.textContent=h.text||'';
  const sg=document.querySelector('#services-grid');
  if(sg) sg.innerHTML=(data.services||[]).map(([key,title,desc,tag])=>`<article class="card"><div class="icon">${icons[key]||'✦'}</div>${tag?`<span class="tag">${tag}</span>`:''}<h3>${title}</h3><p>${desc}</p></article>`).join('');
  const pg=document.querySelector('#portfolio-grid');
  if(pg) pg.innerHTML=(data.portfolio||[]).map(p=>`<article class="portfolio-item" data-cat="${p.categoria}" data-city="${p.cidade}"><img src="imagens/${p.arquivo}" alt="${p.titulo} — ${p.cidade}" loading="lazy" onerror="this.style.display='none'"><div class="pbody"><strong>${p.titulo}</strong><small>${p.categoria} • ${p.cidade}</small></div></article>`).join('');
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
  try{ const r=await fetch(DATA_URL); const data=await r.json(); renderHome(data); setupQuoteForm(); }
  catch(err){ console.error(err); setWhatsApp(); setupQuoteForm(); }
}
boot();
