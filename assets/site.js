// live "on duty" clock
function vgTick(){
  const el = document.getElementById('clock');
  if(!el) return;
  const d = new Date();
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  el.textContent = 'ON DUTY ' + hh + ':' + mm + ':' + ss;
}
vgTick();
setInterval(vgTick, 1000);

// live ops ticker
const vgEvents = [
  {tag:'dispatch', text:'Load #48213 dispatched — Denver, CO → Chicago, IL'},
  {tag:'breakdown', text:'Breakdown reported, I-40 mile marker 212 — tow en route'},
  {tag:'recruiting', text:'Driver onboarding complete — J. Alvarez, Reefer certified'},
  {tag:'compliance', text:'DOT audit prep completed — Carrier #0092'},
  {tag:'scheduling', text:'Dock appointment confirmed — 6:00 AM, Distribution Center 4'},
  {tag:'safety', text:'CSA score review complete — Carrier #0044, zero violations'},
  {tag:'dispatch', text:'Load #48226 covered — Dallas, TX → Atlanta, GA'},
  {tag:'breakdown', text:'Roadside repair closed out — truck back on I-40 in 96 min'},
];
function vgFmtTime(offsetMin){
  const d = new Date(Date.now() - offsetMin*60000);
  return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}
(function buildTicker(){
  const track = document.getElementById('tickerTrack');
  if(!track) return;
  function buildTick(ev, idx){
    const span = document.createElement('span');
    span.className = 'tick';
    span.innerHTML = '<span class="t-time">'+vgFmtTime(idx*4)+'</span><span>'+ev.text+'</span><span class="t-tag">'+ev.tag+'</span>';
    return span;
  }
  [...vgEvents, ...vgEvents].forEach((ev,i)=> track.appendChild(buildTick(ev, i % vgEvents.length)));
})();

// scroll reveal
(function reveal(){
  const revealEls = document.querySelectorAll('[data-reveal]');
  if(!revealEls.length) return;
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(el=> io.observe(el));
  } else {
    revealEls.forEach(el=> el.classList.add('in-view'));
  }
})();

// desktop dropdown nav
(function dropdown(){
  const trigger = document.getElementById('servicesTrigger');
  const menu = document.getElementById('servicesDropdown');
  if(!trigger || !menu) return;
  function closeMenu(){ menu.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); }
  function openMenu(){ menu.classList.add('open'); trigger.setAttribute('aria-expanded','true'); }
  trigger.addEventListener('click', (e)=>{
    e.stopPropagation();
    if(menu.classList.contains('open')) closeMenu(); else openMenu();
  });
  document.addEventListener('click', (e)=>{
    if(!menu.contains(e.target) && e.target !== trigger) closeMenu();
  });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeMenu(); });
})();

// mobile nav toggle
(function mobileNav(){
  const btn = document.getElementById('mobileToggle');
  const nav = document.getElementById('mobileNav');
  if(!btn || !nav) return;
  btn.addEventListener('click', ()=>{
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Netlify lead form — AJAX submit so the page doesn't reload
(function leadForm(){
  const form = document.getElementById('fleetReviewForm');
  const status = document.getElementById('formStatus');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formData = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams(formData).toString(),
    })
    .then(()=>{
      form.reset();
      if(status){ status.classList.add('show'); status.textContent = "Thanks — a dispatcher will be in touch within one business day."; status.style.color = 'var(--green)'; }
    })
    .catch(()=>{
      if(status){ status.classList.add('show'); status.textContent = "Something went wrong sending that — please call or email us directly."; status.style.color = 'var(--red)'; }
    });
  });
})();
