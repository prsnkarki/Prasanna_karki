/* ══ ALL VARIABLES DECLARED FIRST ══ */
const backToTop = document.getElementById('backToTop');
const nav       = document.getElementById('nav');
const loader    = document.getElementById('loader');
const curtain   = document.getElementById('curtain');
const brackets  = document.getElementById('brackets');
const prsnHero  = document.getElementById('prsn-hero');
const burger    = document.getElementById('burger');
const mob       = document.getElementById('mobileNav');
const dot       = document.getElementById('curDot');
const ring      = document.getElementById('curRing');
const aura      = document.getElementById('aura');

/* ── back to top ── */
backToTop.addEventListener('click',e=>{
  e.preventDefault();
  window.scrollTo({top:0,behavior:'smooth'});
});

/* ── cursor ── */
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
  aura.style.left=mx+'px'; aura.style.top=my+'px';
});
(function loop(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
document.querySelectorAll('a,button,.nav-burger,.hc-badge').forEach(el=>{
  el.addEventListener('mouseenter',()=>{dot.style.width='13px';dot.style.height='13px';ring.style.width='50px';ring.style.height='50px';ring.style.borderColor='rgba(232,22,58,.8)';});
  el.addEventListener('mouseleave',()=>{dot.style.width='7px';dot.style.height='7px';ring.style.width='32px';ring.style.height='32px';ring.style.borderColor='rgba(232,22,58,.5)';});
});

/* ── PRSN hero bracket parallax ── */
prsnHero.addEventListener('mouseenter',()=>prsnHero.classList.add('hovered'));
prsnHero.addEventListener('mouseleave',()=>{prsnHero.classList.remove('hovered');brackets.querySelectorAll('.bk').forEach(b=>b.style.transform='');});
prsnHero.addEventListener('mousemove',e=>{
  const r=prsnHero.getBoundingClientRect(),cx=(e.clientX-r.left)/r.width,cy=(e.clientY-r.top)/r.height,m=16;
  [[0,0],[1,0],[0,1],[1,1]].forEach(([ox,oy],i)=>{
    brackets.querySelectorAll('.bk')[i].style.transform=`translate(${(cx-ox)*m}px,${(cy-oy)*m}px)`;
  });
});

/* ── phrases rotation ── */
const phrases=[...document.querySelectorAll('.phrase')]; let cur=0;
if(phrases.length){
  phrases.forEach((p,i)=>{
    p.classList.toggle('visible', i===0);
    p.setAttribute('aria-hidden', i===0 ? 'false' : 'true');
  });
  setInterval(()=>{
    phrases[cur].classList.remove('visible');
    phrases[cur].setAttribute('aria-hidden','true');
    cur=(cur+1)%phrases.length;
    phrases[cur].classList.add('visible');
    phrases[cur].setAttribute('aria-hidden','false');
  },2800);
}

/* ── nav logo → home ── */
document.querySelector('.nav-logo').addEventListener('click',e=>{
  e.preventDefault();
  window.scrollTo({top:0,behavior:'smooth'});
});

/* ── nav scroll + active link ── */
const navLinks=document.querySelectorAll('.nav-links a');
const sections=[];
navLinks.forEach(a=>{
  const id=a.getAttribute('href').replace('#','');
  const el=document.getElementById(id);
  if(el) sections.push({el,a});
});
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>10);
  backToTop.classList.toggle('visible',window.scrollY>400);
  let current='';
  sections.forEach(({el,a})=>{ if(window.scrollY>=el.offsetTop-120) current=a.getAttribute('href'); });
  navLinks.forEach(a=>{ a.classList.toggle('active',a.getAttribute('href')===current); });
});

/* ── burger ── */
burger.addEventListener('click',()=>{burger.classList.toggle('open');mob.classList.toggle('open');});
mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('open');mob.classList.remove('open');}));

/* ── scroll reveal (cards) ── */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target,d=parseInt(el.dataset.delay||0);
      setTimeout(()=>el.classList.add('vis'),d);
      io.unobserve(el);
    }
  });
},{threshold:0.1});
document.querySelectorAll('.card').forEach(c=>io.observe(c));
document.querySelectorAll('.svc-card').forEach(c=>io.observe(c));

/* ── service card active on click ── */
document.querySelectorAll('.svc-card').forEach(card=>{
  card.addEventListener('click',()=>{
    const isActive=card.classList.contains('active');
    document.querySelectorAll('.svc-card').forEach(c=>c.classList.remove('active'));
    if(!isActive) card.classList.add('active');
  });
});

/* ── count-up — fires when stats scroll into view ── */
let countDone = false;
function runCount(){
  if(countDone) return;
  countDone = true;
  document.querySelectorAll('[data-t]').forEach(n=>{
    const target=parseInt(n.dataset.t),suffix=n.dataset.s||'',dur=1600,st=performance.now();
    n.textContent='0'+suffix;
    (function tick(now){
      const p=Math.min((now-st)/dur,1),ease=1-Math.pow(1-p,4);
      n.textContent=Math.round(ease*target)+suffix;
      if(p<1)requestAnimationFrame(tick);
    })(st);
  });
}
/* Observe the stats section */
const statsEl = document.querySelector('.hero-stats');
if(statsEl){
  const statsObs = new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){ runCount(); statsObs.disconnect(); }
  },{threshold:0.4});
  statsObs.observe(statsEl);
}

/* ── ripple ── */
document.querySelectorAll('.btn-solid,.btn-outline,.btn-ghost').forEach(btn=>{
  btn.addEventListener('click',function(e){
    const r=this.getBoundingClientRect(),rip=document.createElement('span');
    Object.assign(rip.style,{position:'absolute',width:'10px',height:'10px',borderRadius:'50%',background:'rgba(255,255,255,.25)',pointerEvents:'none',left:(e.clientX-r.left-5)+'px',top:(e.clientY-r.top-5)+'px',animation:'none',transform:'scale(0)',transition:'transform .5s, opacity .5s',opacity:'1'});
    this.appendChild(rip);
    requestAnimationFrame(()=>{rip.style.transform='scale(8)';rip.style.opacity='0';});
    setTimeout(()=>rip.remove(),600);
  });
});

/* ── LOADER SEQUENCE — runs last so all vars are ready ── */
document.body.style.overflow='hidden';
function launch(){
  curtain.classList.add('curtain-run');
  setTimeout(()=>loader.classList.add('hide'),200);
  setTimeout(()=>nav.classList.add('in'),520);
  setTimeout(()=>{
    brackets.querySelectorAll('.bk').forEach((b,i)=>setTimeout(()=>b.classList.add('in'),i*80));
  },680);
  setTimeout(()=>{
    document.querySelectorAll('.reveal').forEach(el=>setTimeout(()=>el.classList.add('in'),parseInt(el.dataset.delay||0)));
    document.querySelectorAll('.rv').forEach(el=>setTimeout(()=>el.classList.add('in'),parseInt(el.dataset.d||0)));
  },750);
  setTimeout(()=>{
    const si=document.getElementById('scrollInd');
    if(si){si.style.animationName='none';si.style.opacity='0.35';}
  },1400);
  setTimeout(()=>{document.body.style.overflow='';},800);
}
setTimeout(launch,900);
/* ── Bold Scroll Reveal Observer ── */
(function(){
  const srEls = document.querySelectorAll('[data-sr]');
  const srGroups = document.querySelectorAll('[data-sr-group]');
  const srOpts = {threshold:0.12, rootMargin:'0px 0px -40px 0px'};

  const srObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const el = e.target;
        const delay = parseInt(el.dataset.srDelay || 0);
        setTimeout(() => el.classList.add('sr-visible'), delay);
        srObs.unobserve(el);
      }
    });
  }, srOpts);

  srEls.forEach((el, i) => {
    el.dataset.srDelay = el.dataset.srDelay || (i % 4) * 80;
    srObs.observe(el);
  });

  const grpObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('sr-visible');
        grpObs.unobserve(e.target);
      }
    });
  }, srOpts);

  srGroups.forEach(g => grpObs.observe(g));

  /* Also add data-sr to footer columns for a nice stagger */
  document.querySelectorAll('.footer-col').forEach((col, i) => {
    col.setAttribute('data-sr', 'fade-up');
    col.dataset.srDelay = i * 100;
    srObs.observe(col);
  });
  const footerBrand = document.querySelector('.footer-brand');
  if(footerBrand){ footerBrand.setAttribute('data-sr','fade-up'); footerBrand.dataset.srDelay='0'; srObs.observe(footerBrand); }
})();