const $ = (q, s=document)=>s.querySelector(q);
const $$ = (q, s=document)=>[...s.querySelectorAll(q)];

document.addEventListener('DOMContentLoaded', () => {
  // Year
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  // Theme toggle
  const toggle = $('#themeToggle');
  let dark = true;
  if (toggle){
    toggle.addEventListener('click', () => {
      dark = !dark;
      document.documentElement.style.setProperty('--bg', dark ? '#0b1020' : '#f4f7ff');
      document.body.style.color = dark ? '#eaf0ff' : '#0b1020';
    });
  }

  // Reveal on scroll
  const revObs = new IntersectionObserver((ents)=> {
    ents.forEach(e=> e.target.classList.toggle('is-visible', e.isIntersecting));
  }, {threshold: 0.25});
  $$('.reveal').forEach(el=>revObs.observe(el));

  // Count-up stats
  const counters = $$('.count');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = +el.dataset.target;
        let cur = 0;
        const step = Math.max(1, Math.round(target/80));
        const iv = setInterval(() => {
          cur += step;
          if(cur >= target){ cur = target; clearInterval(iv) }
          el.textContent = cur;
        }, 20);
        counterObs.unobserve(el);
      }
    });
  }, {threshold:0.6});
  counters.forEach(c=>counterObs.observe(c));

  // Tilt cards
  $$('.tilt').forEach(card=>{
    card.addEventListener('pointermove', e=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `rotateX(${(-y*6)}deg) rotateY(${(x*8)}deg) translateZ(0)`;
    });
    card.addEventListener('pointerleave', ()=> card.style.transform='');
  });

  // Canvas background particles
  const canvas = document.getElementById('bg-canvas');
  if (canvas){
    const ctx = canvas.getContext('2d');
    let w,h,particles;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize(){
      w = canvas.width = innerWidth * DPR;
      h = canvas.height = innerHeight * DPR;
      canvas.style.width = innerWidth+'px';
      canvas.style.height = innerHeight+'px';
      particles = new Array(90).fill(0).map(()=>({
        x: Math.random()*w, y: Math.random()*h, r: Math.random()*2 + 0.5,
        vx: (Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3
      }));
    }
    window.addEventListener('resize', resize);
    resize();

    function tick(){
      ctx.clearRect(0,0,w,h);
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#7aa2ff';
      particles.forEach(p=>{
        p.x += p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w) p.vx*=-1;
        if(p.y<0||p.y>h) p.vy*=-1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  // GSAP entrance if available
  if (window.gsap){
    gsap.utils.toArray('.fade-up').forEach((el,i)=>{
      gsap.fromTo(el, {y:20, opacity:0}, {y:0, opacity:1, duration:0.8, delay:i*0.15, ease:'power2.out'});
    });
    gsap.utils.toArray('.parallax img').forEach((img, i)=>{
      gsap.to(img, {y: i%2===0 ? -10 : 10, repeat:-1, yoyo:true, duration:6, ease:'sine.inOut'});
    });
  }
});

