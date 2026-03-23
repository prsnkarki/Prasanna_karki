/* ── CURSOR ── */
const dot=document.getElementById('curDot'),ring=document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
(function loop(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
document.querySelectorAll('a,button,.svc-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{dot.style.width='13px';dot.style.height='13px';ring.style.width='50px';ring.style.height='50px';ring.style.borderColor='rgba(232,22,58,.8)';});
  el.addEventListener('mouseleave',()=>{dot.style.width='7px';dot.style.height='7px';ring.style.width='32px';ring.style.height='32px';ring.style.borderColor='rgba(232,22,58,.5)';});
});

/* ── HERO BRACKETS ── */
(function(){
  const bks=document.querySelectorAll('#heroBrackets .bk');
  const delays=[600,750,900,1050];
  bks.forEach((b,i)=>setTimeout(()=>b.classList.add('in'),delays[i]));
})();

/* ── SCROLL REVEAL ── */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const d=parseInt(e.target.dataset.d||0);
      setTimeout(()=>e.target.classList.add('in'),d);
      io.unobserve(e.target);
    }
  });
},{threshold:0.06});
document.querySelectorAll('.rv').forEach(el=>{
  if(el.getBoundingClientRect().top<window.innerHeight){
    setTimeout(()=>el.classList.add('in'),400+parseInt(el.dataset.d||0));
  } else { io.observe(el); }
});

/* ── EXPERTISE BARS ── */
const barObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.exp-fill').forEach((fill,i)=>{
        setTimeout(()=>{fill.classList.add('animated');},i*120);
      });
      barObs.unobserve(e.target);
    }
  });
},{threshold:0.2});
document.querySelectorAll('.expertise-grid').forEach(g=>barObs.observe(g));

/* ── BURGER ── */
const burger=document.getElementById('burger'),mob=document.getElementById('mobileNav');
burger.addEventListener('click',()=>{burger.classList.toggle('open');mob.classList.toggle('open');});

/* ════════════════════════════════════
   HERO CANVAS
════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('heroBars');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const WORDS=['CRAFT','IDENTITY','MOTION','BRAND','DESIGN','BOLD','CINEMATIC','VISUAL','PIXEL','STORY','CREATE','BUILD','FRAME','TYPE','COLOR','STUDIO','EDIT','SHAPE','MARK','DIGITAL'];
  const PHRASES=['NO COMPROMISE','BUILT DIFFERENT','EVERY PIXEL COUNTS','CRAFT OVER SPEED','BOLD BY DESIGN','LEAVE A MARK','STAY OBSESSED','NEPAL TO THE WORLD','MAKE IT MATTER','DESIGN IS INTENT'];
  const COLORS=['rgba(232,22,58,','rgba(42,76,200,','rgba(184,190,221,','rgba(140,60,220,'];
  let items=[],W,H;
  function resize(){
    const hero=document.getElementById('hero');
    W=canvas.width=hero?hero.offsetWidth:window.innerWidth;
    H=canvas.height=hero?hero.offsetHeight:window.innerHeight;
    items=[];
    for(let i=0;i<18;i++) items.push(makeItem(false,'word'));
    for(let i=0;i<10;i++) items.push(makeItem(false,'phrase'));
  }
  function rand(a,b){return a+Math.random()*(b-a);}
  function makeItem(startOffscreen,type){
    const isWord=(type==='word');
    const fromLeft=Math.random()>0.5;
    const color=COLORS[Math.floor(Math.random()*COLORS.length)];
    const text=isWord?WORDS[Math.floor(Math.random()*WORDS.length)]:PHRASES[Math.floor(Math.random()*PHRASES.length)];
    const size=isWord?rand(40,100):rand(9,13);
    const maxAlpha=isWord?rand(0.025,0.07):rand(0.12,0.32);
    const speed=isWord?rand(0.08,0.22):rand(0.15,0.55);
    const y=rand(isWord?0.08*H:0.04*H,isWord?0.92*H:0.96*H);
    const x=startOffscreen?(fromLeft?-800:W+200):rand(-100,W+100);
    const font=isWord?`900 ${size}px 'Barlow Condensed',sans-serif`:`700 ${size}px 'JetBrains Mono',monospace`;
    return{x,y,text,font,speed,fromLeft,color,maxAlpha,opacity:startOffscreen?0:rand(0,maxAlpha),phase:startOffscreen?'in':'hold',holdT:rand(60,isWord?500:250),type};
  }
  function respawnItem(it){
    const isWord=(it.type==='word');
    it.fromLeft=Math.random()>0.5;
    it.color=COLORS[Math.floor(Math.random()*COLORS.length)];
    it.text=isWord?WORDS[Math.floor(Math.random()*WORDS.length)]:PHRASES[Math.floor(Math.random()*PHRASES.length)];
    const size=isWord?rand(40,100):rand(9,13);
    it.font=isWord?`900 ${size}px 'Barlow Condensed',sans-serif`:`700 ${size}px 'JetBrains Mono',monospace`;
    it.maxAlpha=isWord?rand(0.025,0.07):rand(0.12,0.32);
    it.speed=isWord?rand(0.08,0.22):rand(0.15,0.55);
    it.y=rand(isWord?0.08*H:0.04*H,isWord?0.92*H:0.96*H);
    it.x=it.fromLeft?-800:W+200;
    it.opacity=0; it.phase='in';
    it.holdT=rand(60,isWord?500:250);
  }
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,W,H);
    frame++;
    if(frame%110===0) items.push(makeItem(true,'word'));
    if(frame%80===0) items.push(makeItem(true,'phrase'));
    for(let i=items.length-1;i>=0;i--){
      const it=items[i];
      it.x+=it.fromLeft?it.speed:-it.speed;
      if(it.phase==='in'){it.opacity=Math.min(it.opacity+0.004,it.maxAlpha);if(it.opacity>=it.maxAlpha){it.phase='hold';it.holdT=rand(60,it.type==='word'?500:250);}}
      else if(it.phase==='hold'){if(--it.holdT<=0) it.phase='out';}
      else{it.opacity-=0.003;if(it.opacity<=0){respawnItem(it);continue;}}
      if(it.fromLeft&&it.x>W+400){respawnItem(it);continue;}
      if(!it.fromLeft&&it.x<-800){respawnItem(it);continue;}
      ctx.font=it.font;
      ctx.fillStyle=it.color+it.opacity.toFixed(3)+')';
      ctx.fillText(it.text,it.x,it.y);
    }
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize',resize);
  draw();
})();

/* ── ROTATING HERO TEXT ── */
(function(){
  const list=document.getElementById('rotateList');
  if(!list)return;
  function getH(){return list.querySelector('.rotate-item').offsetHeight||100;}
  let idx=0,total=4,locked=false;
  function tick(){
    if(locked)return;
    locked=true;idx++;
    const h=getH();
    list.style.transition='transform .9s cubic-bezier(.16,1,.3,1)';
    list.style.transform=`translateY(-${idx*h}px)`;
    if(idx>=total){setTimeout(()=>{list.style.transition='none';list.style.transform='translateY(0)';idx=0;setTimeout(()=>{locked=false;},50);},950);}
    else{setTimeout(()=>{locked=false;},950);}
  }
  document.fonts.ready.then(()=>{setInterval(tick,3200);});
})();

/* ════════════════════════════════════
   SERVICES SPIDER DIAGRAM
════════════════════════════════════ */
// ══ SERVICES SPIDER ══
(function(){
  var stage  = document.getElementById('lcStage');
  if (!stage) return;
  var spokes = stage.querySelectorAll('.lc-spoke');
  var dots   = stage.querySelectorAll('.lc-joint-dot');
  var cards  = stage.querySelectorAll('.lc-card');
  var rings  = document.querySelectorAll('.lc-ring');
  var ghost  = stage.querySelector('.lc-spider-ghost');
  var fired  = false;
  var lockedNi = 0; // start locked on PRSN center

  var niToRing = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };

  // Service data for each node
  var svcData = {
    0: { num:'00', title:'PRSN.CO', desc:'One studio. Five disciplines. We are PRSN — a Nepali creative studio that builds bold brand identities, digital experiences, and visual systems. From Kathmandu to the world.', tags:['Brand','Web','Motion','Identity','Nepal'] },
    1: { num:'01', title:'Web Design', desc:'We craft pixel-perfect digital experiences that stop the scroll — combining sharp visual hierarchy, fluid interactions, and purposeful layouts that convert visitors into believers.', tags:['Responsive','UI Systems','Performance'] },
    2: { num:'02', title:'UI / UX', desc:'Every tap, click, and scroll is intentional. We design interfaces that feel effortless — mapping user journeys with precision so your product\'s experience matches its potential.', tags:['User Research','Prototyping','Usability'] },
    3: { num:'03', title:'Brand Identity', desc:'A brand is not just a logo — it\'s a system. We build complete brand identities from the ground up: marks, typography, colour, tone, and the rules that keep it all consistent.', tags:['Logo Design','Typography','Guidelines'] },
    4: { num:'04', title:'Graphic Design', desc:'From editorial layouts to poster art, social assets to print collateral — we apply obsessive craft to every format. Visuals that carry weight and leave an impression.', tags:['Print','Editorial','Digital Assets'] },
    5: { num:'05', title:'Creative Dev', desc:'We don\'t just design — we build. Motion, interaction, and code come together to produce experiences that go beyond a static mockup. Where design ends, creative development begins.', tags:['Frontend','Motion','Interactive'] },
  };

  var panelLeaveTimer = null;

  /* ── SCROLL REVEAL ── */
  new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting || fired) return;
      fired = true;
      spokes.forEach(function(s,i){
        setTimeout(function(){ s.classList.add('drawn'); }, 60 + i * 120);
      });
      dots.forEach(function(d,i){
        setTimeout(function(){ d.classList.add('show'); }, 320 + i * 80);
      });
      cards.forEach(function(c,i){
        setTimeout(function(){
          c.classList.add('revealed');
          var ri = niToRing[parseInt(c.getAttribute('data-ni')||'0')];
          var ring = document.getElementById('lcr'+ri);
          if (ring){
            ring.classList.add('visible');
            setTimeout(function(){ ring.classList.add('pulse'); }, 80);
            setTimeout(function(){ ring.classList.remove('pulse'); }, 1700);
          }
        }, 160 + i * 100);
      });
      // Show PRSN default panel once cards reveal
      setTimeout(function(){
        showService(0);
        // Mark center card as default active
        var centerCard = stage.querySelector('.lc-card[data-ni="0"]');
        if (centerCard) centerCard.classList.add('active');
      }, 900);
    });
  }, {threshold: 0.1}).observe(stage);

  /* ── PANEL LOGIC ── */
  function showService(ni) {
    var d = svcData[ni];
    if (!d) return;
    var panel   = document.getElementById('svcPanel');
    var idle    = document.getElementById('svcIdle');
    var content = document.getElementById('svcContent');
    if (!panel || !idle || !content) return;

    idle.style.display = 'none';
    content.style.display = 'flex';

    // re-trigger animation
    content.style.animation = 'none';
    void content.offsetWidth;
    content.style.animation = '';

    document.getElementById('svcNum').textContent   = d.num;
    document.getElementById('svcTitle').textContent = d.title;
    document.getElementById('svcDesc').textContent  = d.desc;

    var tagsEl = document.getElementById('svcTags');
    tagsEl.innerHTML = d.tags.map(function(t){ return '<span>'+t+'</span>'; }).join('');

    panel.classList.add('active');
  }

  function restoreDefault() {
    // always fall back to PRSN intro
    showService(lockedNi);
    // reset visual states but keep center card active
    cards.forEach(function(c){
      var ni = parseInt(c.getAttribute('data-ni')||'0');
      if (ni !== lockedNi) c.classList.remove('active');
    });
    spokes.forEach(function(s){ s.classList.remove('lit'); s.classList.remove('active'); });
    dots.forEach(function(d){ d.classList.remove('lit'); });
    rings.forEach(function(r){ r.classList.remove('pulse'); r.classList.remove('visible'); });
    if (ghost) ghost.classList.remove('active');
    var sec = stage.closest('.svc-section');
    if (sec) sec.classList.remove('spider-active');
  }

  /* ── HOVER ── */
  cards.forEach(function(card){
    var ni  = parseInt(card.getAttribute('data-ni') || '0');
    var tip = card.querySelector('.lc-tip');

    card.addEventListener('mouseenter', function(){
      // cancel any pending restore
      clearTimeout(panelLeaveTimer);

      if (ghost) ghost.classList.add('active');
      var sec = stage.closest('.svc-section');
      if (sec) sec.classList.add('spider-active');

      // light the correct spoke
      spokes.forEach(function(s){ s.classList.remove('lit'); });
      dots.forEach(function(d){ d.classList.remove('lit'); });
      if (ni === 0) {
        spokes.forEach(function(s){ s.classList.add('lit'); });
        dots.forEach(function(d){ d.classList.add('lit'); });
      } else {
        var sp = document.getElementById('lcs' + (ni - 1));
        if (sp) sp.classList.add('lit');
        var jd = document.getElementById('lcd' + (ni - 1));
        if (jd) jd.classList.add('lit');
      }

      // rings
      rings.forEach(function(r){ r.classList.remove('pulse'); r.classList.remove('visible'); });
      var ri = niToRing[ni];
      var myRing = document.getElementById('lcr' + ri);
      if (myRing) { myRing.classList.add('visible'); myRing.classList.add('pulse'); }
      rings.forEach(function(r, idx){ if (idx !== ri) r.classList.add('visible'); });

      if (tip) tip.classList.add('show');
      showService(ni);
    });

    card.addEventListener('mouseleave', function(){
      if (tip) tip.classList.remove('show');
      // delay restore so quick mouse moves between nodes feel smooth
      panelLeaveTimer = setTimeout(restoreDefault, 600);
    });

    /* ── CLICK → lock this service ── */
    card.addEventListener('click', function(){
      clearTimeout(panelLeaveTimer);
      lockedNi = ni;

      cards.forEach(function(c){ c.classList.remove('active'); });
      spokes.forEach(function(s){ s.classList.remove('active'); });
      card.classList.add('active');

      if (ni === 0) {
        spokes.forEach(function(s){ s.classList.add('active'); });
      } else {
        var sp = document.getElementById('lcs' + (ni - 1));
        if (sp) sp.classList.add('active');
      }

      var ri = niToRing[ni];
      var myRing = document.getElementById('lcr' + ri);
      if (myRing){
        myRing.classList.remove('pulse');
        void myRing.offsetWidth;
        myRing.classList.add('pulse');
      }
      showService(ni);
    });
  });

  // "Start a Project" btn → scroll to CTA
  var svcBtn = document.getElementById('svcBtn');
  if (svcBtn) {
    svcBtn.addEventListener('click', function(){
      var cta = document.getElementById('cta');
      if (cta) cta.scrollIntoView({behavior:'smooth'});
    });
  }
})();
