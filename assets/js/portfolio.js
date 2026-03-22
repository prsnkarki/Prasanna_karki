const cursorDot  = document.getElementById('curDot');
const cursorRing = document.getElementById('curRing');
let mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cursorDot.style.left=mx+'px'; cursorDot.style.top=my+'px';
});
function lerp(a,b,t){return a+(b-a)*t;}
(function tick(){
  rx=lerp(rx,mx,.1); ry=lerp(ry,my,.1);
  cursorRing.style.left=rx+'px'; cursorRing.style.top=ry+'px';
  requestAnimationFrame(tick);
})();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursorRing.style.width='52px';cursorRing.style.height='52px';cursorRing.style.borderColor='rgba(232,22,58,1)';});
  el.addEventListener('mouseleave',()=>{cursorRing.style.width='36px';cursorRing.style.height='36px';cursorRing.style.borderColor='rgba(232,22,58,.8)';});
});
// Count-up on scroll into view
const countEls = document.querySelectorAll('.count-up');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = '1';
      const target = +entry.target.dataset.target;
      const duration = 1400;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else entry.target.textContent = target;
      }
      requestAnimationFrame(step);
    }
  });
}, { threshold: 0.5 });
countEls.forEach(el => countObserver.observe(el));

document.getElementById('burger').addEventListener('click',()=>{
  document.getElementById('burger').classList.toggle('open');
  document.getElementById('mobileNav').classList.toggle('open');
});


// ── Process orbit interaction ──
const steps = [
  { title:"Discovery",  eyebrow:"Step 01 / 06", desc:"We start by getting deep inside your world  -  understanding your brand, your audience, and your goals. No assumptions. Just sharp questions and sharper listening.", tags:["Brief","Research","Goals"], progress:"16.6%" },
  { title:"Strategy",   eyebrow:"Step 02 / 06", desc:"With insights in hand, we map out a clear creative direction. Positioning, messaging, and the visual language that will carry your brand forward.", tags:["Positioning","Direction","Roadmap"], progress:"33.3%" },
  { title:"Design",     eyebrow:"Step 03 / 06", desc:"Ideas become visuals. We craft every element with intention  -  from typography and colour to layout and motion  -  always balancing beauty with purpose.", tags:["Visual Design","UI","Brand System"], progress:"50%" },
  { title:"Refine",     eyebrow:"Step 04 / 06", desc:"We present, you respond. Every round of feedback is a chance to sharpen and elevate. We iterate until the work feels undeniably right.", tags:["Feedback","Iteration","Polish"], progress:"66.6%" },
  { title:"Build",      eyebrow:"Step 05 / 06", desc:"Designs move into production. Code, print files, or motion assets  -  we build with precision, making sure every detail survives the transition.", tags:["Development","Production","QA"], progress:"83.3%" },
  { title:"Launch",     eyebrow:"Step 06 / 06", desc:"We go live. Assets are delivered, systems are handed over, and your brand enters the world exactly as intended. Clean, complete, and ready to perform.", tags:["Delivery","Handoff","Live"], progress:"100%" },
];

function activateStep(idx) {
  // update nodes
  document.querySelectorAll('.po-node').forEach(n => n.classList.remove('active'));
  document.querySelector('.po-node[data-i="'+idx+'"]').classList.add('active');
  // update lines
  document.querySelectorAll('.po-line').forEach(l => l.classList.remove('active'));
  document.querySelector('.po-line[data-i="'+idx+'"]').classList.add('active');
  // update center sub
  document.getElementById('poCenterSub').textContent = '0'+(idx+1);
  // fade panel
  const inner = document.getElementById('poDetail');
  inner.classList.add('fade');
  setTimeout(() => {
    const s = steps[idx];
    document.getElementById('poEyebrow').textContent  = s.eyebrow;
    document.getElementById('poTitle').textContent    = s.title;
    document.getElementById('poDesc').textContent     = s.desc;
    document.getElementById('poProgress').style.width = s.progress;
    const tagsEl = document.getElementById('poTags');
    tagsEl.innerHTML = s.tags.map(t => '<span>'+t+'</span>').join('');
    document.querySelectorAll('.po-detail-dot').forEach((d,i) => d.classList.toggle('active', i===idx));
    inner.classList.remove('fade');
  }, 200);
}

document.querySelectorAll('.po-node').forEach(node => {
  node.addEventListener('click', () => activateStep(+node.dataset.i));
  node.addEventListener('mouseenter', () => activateStep(+node.dataset.i));
});
document.querySelectorAll('.po-detail-dot').forEach(dot => {
  dot.addEventListener('click', () => activateStep(+dot.dataset.i));
});
// activate first line
document.querySelector('.po-line[data-i="0"]').classList.add('active');

// Touch support for corner hover effect on mobile
document.querySelectorAll('.hfc').forEach(corner => {
  corner.addEventListener('touchstart', e => {
    e.preventDefault();
    const isActive = corner.classList.contains('touched');
    // clear all others first
    document.querySelectorAll('.hfc').forEach(c => c.classList.remove('touched'));
    if (!isActive) corner.classList.add('touched');
  }, { passive: false });
});
// tap anywhere else clears
document.addEventListener('touchstart', e => {
  if (!e.target.closest('.hfc')) {
    document.querySelectorAll('.hfc').forEach(c => c.classList.remove('touched'));
  }
});



// ══ OUR WORK SECTION ══
/* ── PARTICLE NETWORK ── */
const canvas  = document.getElementById('bgCanvas');
const ctx     = canvas.getContext('2d');
const section = canvas.parentElement;

let W, H, particles;
const COUNT    = 90;
const MAX_DIST = 150;
const SPEED    = 0.38;

function resize(){
  W = canvas.width  = section.offsetWidth;
  H = canvas.height = section.offsetHeight;
}

function mkParticle(){
  const isBlue = Math.random() > .4;
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - .5) * SPEED,
    vy: (Math.random() - .5) * SPEED,
    r:  Math.random() * 1.5 + .5,
    // blue or red tint
    cr: isBlue ? 74  : 232,
    cg: isBlue ? 111 : 22,
    cb: isBlue ? 255 : 58,
  };
}

function init(){
  resize();
  particles = Array.from({length: COUNT}, mkParticle);
}

function draw(){
  ctx.clearRect(0, 0, W, H);

  // update positions
  for(const p of particles){
    p.x += p.vx;
    p.y += p.vy;
    if(p.x < 0 || p.x > W) p.vx *= -1;
    if(p.y < 0 || p.y > H) p.vy *= -1;
  }

  // draw connections
  for(let i = 0; i < particles.length; i++){
    for(let j = i+1; j < particles.length; j++){
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < MAX_DIST){
        const alpha = (1 - dist/MAX_DIST) * 0.22;
        // colour blend between the two particles
        const r = (a.cr + b.cr) / 2;
        const g = (a.cg + b.cg) / 2;
        const b_ = (a.cb + b.cb) / 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${r},${g},${b_},${alpha})`;
        ctx.lineWidth = .6;
        ctx.stroke();
      }
    }
  }

  // draw dots
  for(const p of particles){
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${p.cr},${p.cg},${p.cb},.55)`;
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

window.addEventListener('resize', ()=>{ resize(); });
new ResizeObserver(()=>{ resize(); }).observe(section);
init();
draw();

/* ── PILLS ── */
document.querySelectorAll('.ow-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.ow-pill').forEach(p => p.classList.remove('on'));
    pill.classList.add('on');
  });
});





/* wg particles */
(function(){
const wgCv=document.getElementById('wgCanvas'),wgCtx=wgCv.getContext('2d'),wgSec=wgCv.parentElement;
let wW,wH,wPs;
function wRsz(){wW=wgCv.width=wgSec.offsetWidth;wH=wgCv.height=wgSec.offsetHeight;}
function wMkP(){const b=Math.random()>.4;return{x:Math.random()*wW,y:Math.random()*wH,vx:(Math.random()-.5)*.38,vy:(Math.random()-.5)*.38,r:Math.random()*1.5+.5,cr:b?74:232,cg:b?111:22,cb:b?255:58};}
function wInit(){wRsz();wPs=Array.from({length:80},wMkP);}
function wDraw(){
  wgCtx.clearRect(0,0,wW,wH);
  for(const p of wPs){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>wW)p.vx*=-1;if(p.y<0||p.y>wH)p.vy*=-1;}
  for(let i=0;i<wPs.length;i++)for(let j=i+1;j<wPs.length;j++){
    const a=wPs[i],b=wPs[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<140){const al=(1-d/140)*.2,r=(a.cr+b.cr)/2,g=(a.cg+b.cg)/2,bl=(a.cb+b.cb)/2;
    wgCtx.beginPath();wgCtx.moveTo(a.x,a.y);wgCtx.lineTo(b.x,b.y);wgCtx.strokeStyle=`rgba(${r},${g},${bl},${al})`;wgCtx.lineWidth=.6;wgCtx.stroke();}
  }
  for(const p of wPs){wgCtx.beginPath();wgCtx.arc(p.x,p.y,p.r,0,Math.PI*2);wgCtx.fillStyle=`rgba(${p.cr},${p.cg},${p.cb},.5)`;wgCtx.fill();}
  requestAnimationFrame(wDraw);
}
window.addEventListener('resize',wRsz);
wInit();wDraw();
})();
