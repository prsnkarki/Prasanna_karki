/* CURSOR */
const dot=document.getElementById('curDot'),ring=document.getElementById('curRing');
let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  dot.style.left=mx+'px';dot.style.top=my+'px';
});
function lerp(a,b,t){return a+(b-a)*t;}
(function tick(){
  rx=lerp(rx,mx,.1);ry=lerp(ry,my,.1);
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(tick);
})();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='52px';ring.style.height='52px';ring.style.borderColor='rgba(232,22,58,1)';});
  el.addEventListener('mouseleave',()=>{ring.style.width='36px';ring.style.height='36px';ring.style.borderColor='rgba(232,22,58,.8)';});
});

/* BURGER */
const burger=document.getElementById('burger'),mNav=document.getElementById('mobileNav');
burger.addEventListener('click',()=>{burger.classList.toggle('open');mNav.classList.toggle('open');});

/* REVEAL */
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(r=>io.observe(r));

/* SKILL BARS */
const barObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const w=parseFloat(e.target.dataset.width);e.target.style.transform=`scaleX(${w})`;barObs.unobserve(e.target);}}),{threshold:.3});
document.querySelectorAll('.skill-bar-fill').forEach(b=>barObs.observe(b));

/* PAGE DOTS */
const secs=['hero','services','origin','operate','skills','values'];
const pdots=document.querySelectorAll('.pg-dot a');
const sObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){
    const id=e.target.id;
    const idx=secs.indexOf(id);
    if(idx>-1){
      pdots.forEach(d=>d.classList.remove('active'));
      if(pdots[idx]) pdots[idx].classList.add('active');
    }
  }}),{threshold:.3});
secs.forEach(id=>{const el=document.getElementById(id);if(el)sObs.observe(el);});

/* VMAP CONNECTOR LINES */
function drawVmapLines(){
  const svg = document.getElementById('vmapSvg');
  const outer = document.getElementById('vmapOuter');
  const hub = document.getElementById('vmapHub');
  if(!svg||!outer||!hub) return;

  const outerR = outer.getBoundingClientRect();
  const hubR = hub.getBoundingClientRect();
  const hx = hubR.left - outerR.left + hubR.width/2;
  const hy = hubR.top  - outerR.top  + hubR.height/2;

  svg.innerHTML = '';
  svg.setAttribute('width', outerR.width);
  svg.setAttribute('height', outerR.height);

  const nodeIds = ['vn0','vn1','vn2','vn3','vn4','vn5'];
  const isRight = [false,false,false,true,true,true];

  nodeIds.forEach((id,i)=>{
    const el = document.getElementById(id);
    if(!el) return;
    const r = el.getBoundingClientRect();
    const nx = isRight[i] ? r.left - outerR.left : r.right - outerR.left;
    const ny = r.top - outerR.top + r.height/2;
    const color = isRight[i] ? 'rgba(42,76,200,.5)' : 'rgba(232,22,58,.4)';
    const cx1 = hx + (nx - hx) * 0.45;
    const cx2 = hx + (nx - hx) * 0.55;
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',`M${hx},${hy} C${cx1},${hy} ${cx2},${ny} ${nx},${ny}`);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width','1.5');
    path.setAttribute('stroke-dasharray','5 4');
    path.setAttribute('fill','none');
    path.setAttribute('opacity','0.8');
    svg.appendChild(path);
  });
}
window.addEventListener('load', drawVmapLines);
window.addEventListener('resize', drawVmapLines);

window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const sec=document.getElementById(a.getAttribute('href').replace('#',''));
    if(sec){
      const top=sec.offsetTop-100,bot=top+sec.offsetHeight;
      if(y>=top&&y<bot) a.classList.add('active'); else a.classList.remove('active');
    }
  });
});

/* PROCESS WHEEL */
const stepData=[
  {title:'Discovery',desc:'Every project starts with listening. We unpack your goals, audience and constraints, then design a creative path that feels ambitious but achievable.',tags:['Brand Audit','User Research','Competitive Analysis']},
  {title:'Strategy',desc:'We synthesise research into a clear creative direction. Visual language, messaging hierarchy and project roadmap — all locked in before a single screen is designed.',tags:['Creative Brief','Visual Direction','Roadmap']},
  {title:'Design',desc:'We build visual systems, not just screens. Every layout decision is deliberate — grids, type scales, colour tensions calibrated together with cinematic precision.',tags:['UI / UX','Motion Design','Design Systems']},
  {title:'Development',desc:'Clean, performant code that translates design intent without compromise. Built in-house with meticulous attention to performance, accessibility and scale.',tags:['React / Next.js','HTML / CSS / JS','Webflow']},
  {title:'Launch',desc:'Go-live is not the finish line — it\'s the starting gun. We stay close post-launch, monitoring, iterating and optimising so your project grows with you.',tags:['QA Testing','SEO Foundations','Retainer Support']}
];

let activeStep=0;
const nodes=document.querySelectorAll('.pw-node');
const detailTitle=document.getElementById('pwDetailTitle');
const detailDesc=document.getElementById('pwDetailDesc');
const detailTags=document.getElementById('pwDetailTags');
const detailCounter=document.getElementById('pwStepCounter');
const detailContent=document.getElementById('pwDetailContent');
const dotItems=document.querySelectorAll('.pw-dot-item');

// Node positions handled via pure CSS --a angle transforms

function setStep(idx){
  if(idx===activeStep) return;
  activeStep=idx;
  nodes.forEach((n,i)=>n.classList.toggle('active',i===idx));
  dotItems.forEach((d,i)=>d.classList.toggle('active',i===idx));
  detailContent.classList.add('fade-out');
  detailContent.classList.remove('fade-in');
  setTimeout(()=>{
    const d=stepData[idx];
    detailCounter.textContent=`0${idx+1} / 05`;
    detailTitle.textContent=d.title;
    detailDesc.textContent=d.desc;
    detailTags.innerHTML=d.tags.map(t=>`<span>${t}</span>`).join('');
    detailContent.classList.remove('fade-out');
    detailContent.classList.add('fade-in');
  },160);
}

nodes[0].classList.add('active');
nodes.forEach((n,i)=>n.addEventListener('click',()=>setStep(i)));
dotItems.forEach((d,i)=>d.addEventListener('click',()=>setStep(i)));

let autoTimer=setInterval(()=>setStep((activeStep+1)%5),3000);
document.getElementById('pwOrbit')?.addEventListener('mouseenter',()=>clearInterval(autoTimer));
document.getElementById('pwOrbit')?.addEventListener('mouseleave',()=>{autoTimer=setInterval(()=>setStep((activeStep+1)%5),3000);});
/* FAQ ACCORDION */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
