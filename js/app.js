const DATA_URL='data/site.json';
const icons={forro:'▱',sanca:'✦',drywall:'▥',led:'☼',nicho:'◇',reparo:'⌁','sanca-fechada':'◌',comercio:'▤'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function waLink(m='Olá! Gostaria de solicitar um orçamento para um serviço de gesso ou drywall.'){
  const p=window.SITE?.empresa?.whatsapp||'5511976983978';return `https://wa.me/${p}?text=${encodeURIComponent(m)}`;}
function setWhatsApp(m){document.querySelectorAll('.js-wa').forEach(a=>{a.href=waLink(m);a.target='_blank';a.rel='noopener';});}
function portfolioCard(p){
  const info=`<div class="pbody"><strong>${esc(p.titulo)}</strong><small>${esc(p.categoria)} • ${esc(p.cidade)}</small></div>`;
  const attrs=`data-cat="${esc(p.categoria)}" data-city="${esc(p.cidade)}"`;
  const thumb=p.miniatura||p.arquivo;
  if(p.url){
    const vid=/video/.test(p.tipo||'')||/tiktok|instagram|youtube|youtu\.be|facebook|fb\.watch/.test(p.url);
    const img=thumb?`<img src="imagens/${esc(thumb)}" alt="${esc(p.titulo)}" loading="lazy" onerror="this.parentElement.classList.remove('has-img');this.remove()">`:'';
    return `<a class="portfolio-item video-card" ${attrs} href="${esc(p.url)}" target="_blank" rel="noopener"><div class="video-thumb${thumb?' has-img':''}">${img}${vid?'<span>▶</span><em>Assistir vídeo</em>':'<em>Ver mais</em>'}</div>${info}</a>`;
  }
  if(!p.arquivo)return '';
  return `<article class="portfolio-item" ${attrs}><img src="imagens/${esc(p.arquivo)}" alt="${esc(p.titulo)} — ${esc(p.cidade)}" loading="lazy" onerror="this.closest('.portfolio-item').hidden=true">${info}</article>`;
}
function renderHome(data){
  window.SITE=data;const h=data.hero||{};
  const set=(s,v)=>{const e=document.querySelector(s);if(e)e.textContent=v||'';};
  set('#hero-eyebrow',h.eyebrow);set('#hero-title',h.title);set('#hero-text',h.text);
  const sg=document.querySelector('#services-grid');
  if(sg)sg.innerHTML=(data.services||[]).map(([k,t,d,tag])=>`<article class="card"><div class="icon">${icons[k]||'✦'}</div>${tag?`<span class="tag">${esc(tag)}</span>`:''}<h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join('');
  const items=data.portfolio||[];
  const pg=document.querySelector('#portfolio-grid');
  if(pg)pg.innerHTML=items.map(portfolioCard).join('')||'<p class="empty">Em breve novos trabalhos.</p>';
  const rg=document.querySelector('#reviews-grid');
  if(rg)rg.innerHTML=(data.reviews||[]).map(r=>`<article class="review"><p>“${esc(r[1])}”</p><strong>${esc(r[0])}</strong></article>`).join('');
  const fq=document.querySelector('#faq-list');
  if(fq)fq.innerHTML=(data.faq||[]).map(x=>`<details><summary>${esc(x[0])}</summary><p>${esc(x[1])}</p></details>`).join('');
  const filters=document.querySelector('#filters');
  if(filters){
    const used=new Set(items.flatMap(p=>[p.categoria,p.cidade]));
    const opts=['Todos',...[...used].filter(Boolean)];
    filters.innerHTML=opts.map((x,i)=>`<button class="filter ${i?'':'active'}" data-filter="${esc(x)}">${esc(x)}</button>`).join('');
    filters.addEventListener('click',ev=>{
      const b=ev.target.closest('.filter');if(!b)return;
      filters.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');
      const v=b.dataset.filter;
      document.querySelectorAll('.portfolio-item').forEach(c=>{c.hidden=!(v==='Todos'||c.dataset.cat===v||c.dataset.city===v);});
    });
  }
  setWhatsApp('Olá! Vi o site da BelartGesso e gostaria de pedir um orçamento. Posso enviar fotos e informações do ambiente?');
  const y=document.querySelector('#year');if(y)y.textContent=new Date().getFullYear();
  const sc=document.querySelector('#schema');
  if(sc&&data.empresa){sc.textContent=JSON.stringify({'@context':'https://schema.org','@type':'HomeAndConstructionBusiness','name':data.empresa.nome,'url':data.empresa.url,'logo':new URL(data.empresa.logo,location.href).href,'telephone':`+${data.empresa.telefone}`,'areaServed':(data.areas||[]).map(a=>({'@type':'City','name':a})),'hasOfferCatalog':{'@type':'OfferCatalog','name':'Serviços de gesso e drywall','itemListElement':(data.services||[]).map((s,i)=>({'@type':'Offer','position':i+1,'itemOffered':{'@type':'Service','name':s[1],'description':s[2]}}))}});}
}
function setupMenu(){
  const b=document.querySelector('.menu-toggle'),n=document.querySelector('#main-nav');
  if(b&&n){b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o);});
    n.addEventListener('click',e=>{if(e.target.closest('a')){n.classList.remove('open');b.setAttribute('aria-expanded',false);}});}
}
function setupQuoteForm(){
  const f=document.querySelector('#quote-form');if(!f)return;
  f.addEventListener('submit',e=>{
    e.preventDefault();const fd=new FormData(f),g=k=>(fd.get(k)||'').toString().trim();
    const msg=`Olá! Gostaria de solicitar um orçamento com a BelartGesso.\n\nNome: ${g('nome')}\nCidade: ${g('cidade')}\nServiço: ${g('servico')}\nAmbiente: ${g('ambiente')}\nDetalhes: ${g('detalhes')}\n\nPosso enviar fotos do ambiente por aqui.`;
    window.open(waLink(msg),'_blank','noopener');
  });
}
async function boot(){
  setupMenu();
  try{const r=await fetch(DATA_URL);if(!r.ok)throw new Error(r.status);renderHome(await r.json());}
  catch(err){console.error(err);setWhatsApp();}
  setupQuoteForm();
}
boot();
