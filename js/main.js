/* ============================================================
   GHIBLI BIRTHDAY · main.js  (clean rebuild — no bugs)
   ============================================================ */
"use strict";

const qs     = (s, ctx = document) => ctx.querySelector(s);
const qsa    = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const rnd    = (a, b) => Math.random() * (b - a) + a;
const rndInt = (a, b) => Math.floor(rnd(a, b + 1));
const clamp  = (v, a, b) => Math.min(Math.max(v, a), b);

/* ============================================================
   LOADER
============================================================ */
window.addEventListener("load", () => {
  setTimeout(() => {
    qs("#loader").classList.add("hidden");
    initReveal();
    initHero();
  }, 2800);
});

/* ============================================================
   CUSTOM CURSOR
============================================================ */
(() => {
  const glow = qs("#cursor-glow");
  const dot  = qs("#cursor-dot");
  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  });
  (function tick() {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.left = gx + "px";
    glow.style.top  = gy + "px";
    requestAnimationFrame(tick);
  })();
  document.addEventListener("mousedown", () => { dot.style.transform = "translate(-50%,-50%) scale(1.8)"; });
  document.addEventListener("mouseup",   () => { dot.style.transform = "translate(-50%,-50%) scale(1)"; });
})();

/* ============================================================
   SCROLL PROGRESS
============================================================ */
window.addEventListener("scroll", () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  qs("#scroll-progress").style.width = clamp(pct, 0, 100) + "%";
}, { passive: true });

/* ============================================================
   NAVBAR
============================================================ */
(() => {
  const nav  = qs("#navbar");
  const ham  = qs("#hamburger");
  const links = qs("#nav-links");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  }, { passive: true });

  ham.addEventListener("click", () => {
    ham.classList.toggle("active");
    links.classList.toggle("open");
  });
  qsa(".nav-links a").forEach(a => a.addEventListener("click", () => {
    ham.classList.remove("active");
    links.classList.remove("open");
  }));
})();

/* ============================================================
   REVEAL ON SCROLL
============================================================ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = +e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add("revealed"), delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.14 });

  qsa(".reveal, .reveal-left, .reveal-right").forEach((el, i) => {
    if (el.closest(".timeline")) el.dataset.delay = (i % 5) * 90;
    obs.observe(el);
  });
}

/* ============================================================
   HERO
============================================================ */
function initHero() {
  initPetals();
  initTyping();
  initHearts();
  initFireflies();
}

/* Sakura petals */
function initPetals() {
  const canvas = qs("#petals-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, petals = [];
  const COLS = ["#f7c5d5","#f9a8c0","#ffd4e8","#e8b5d0","#fff0f5"];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  class Petal {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x   = rnd(0, W);
      this.y   = init ? rnd(-200, H) : rnd(-20, -4);
      this.r   = rnd(4, 9);
      this.rx  = rnd(0.3, 0.7);
      this.vx  = rnd(-0.6, 0.6);
      this.vy  = rnd(0.5, 1.5);
      this.rot = rnd(0, Math.PI * 2);
      this.dr  = rnd(-0.03, 0.03);
      this.op  = rnd(0.5, 0.9);
      this.col = COLS[rndInt(0, COLS.length - 1)];
      this.wb  = rnd(0, Math.PI * 2);
      this.wbs = rnd(0.02, 0.05);
    }
    update() {
      this.wb += this.wbs;
      this.x  += this.vx + Math.sin(this.wb) * 0.5;
      this.y  += this.vy;
      this.rot += this.dr;
      if (this.y > H + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.op;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.scale(1, this.rx);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.r, this.r * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.col;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 60; i++) petals.push(new Petal());
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
}

/* Typing subtitle */
function initTyping() {
  const el = qs("#typing-text");
  if (!el) return;
  const phrases = [
    "Every day with you feels like a Ghibli film... 🌸",
    "You are the magic in my ordinary world ✨",
    "My heart wrote you a whole universe 🌙",
    "Today belongs entirely to you, my love 💕",
  ];
  let pi = 0, ci = 0, deleting = false, wait = 0;
  function tick() {
    const p = phrases[pi];
    if (!deleting) {
      el.textContent = p.slice(0, ++ci);
      if (ci === p.length) { deleting = true; wait = 60; }
    } else {
      if (wait-- > 0) { setTimeout(tick, 40); return; }
      el.textContent = p.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  setTimeout(tick, 1600);
}

/* Floating hearts */
function initHearts() {
  const wrap = qs("#floating-hearts");
  if (!wrap) return;
  const icons = ["❤","💕","💖","💗","🌸","✨","💫"];
  function spawn() {
    const el = document.createElement("span");
    el.className = "heart";
    el.textContent = icons[rndInt(0, icons.length - 1)];
    el.style.cssText = `left:${rnd(5,95)}%;bottom:${rnd(5,30)}%;font-size:${rnd(.8,1.6)}rem;animation-duration:${rnd(4,8)}s;animation-delay:${rnd(0,2)}s`;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 10000);
  }
  for (let i = 0; i < 8; i++) setTimeout(spawn, i * 600);
  setInterval(spawn, 1500);
}

/* Fireflies */
function initFireflies() {
  const wrap = qs("#fireflies");
  if (!wrap) return;
  for (let i = 0; i < 20; i++) {
    const el = document.createElement("div");
    el.className = "firefly";
    el.style.cssText = `left:${rnd(10,90)}%;top:${rnd(40,90)}%;--tx:${rnd(-60,60)}px;--ty:${rnd(-80,-20)}px;animation-duration:${rnd(3,7)}s;animation-delay:${rnd(0,5)}s;width:${rnd(3,5)}px;height:${rnd(3,5)}px`;
    wrap.appendChild(el);
  }
}

/* ============================================================
   LOVE LETTER — envelope interaction
   The letter-paper is a sibling of .envelope (not a child),
   so it is never clipped. We toggle .open on .envelope-scene.
============================================================ */
(() => {
  const scene   = qs(".envelope-scene");
  const envelope = qs("#envelope");
  const hint     = qs("#env-hint");
  if (!envelope || !scene) return;

  let opened = false;

  envelope.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    envelope.classList.add("open");   // flap rotates
    scene.classList.add("open");      // letter rises
    if (hint) {
      hint.textContent = "💌";
      hint.style.opacity = "0.5";
      hint.style.animation = "none";
    }
  });
})();

/* ============================================================
   STARRY WISHES — canvas + wish cards
============================================================ */
(() => {
  /* Stars canvas */
  const canvas = qs("#stars-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, stars = [], shots = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = qs("#wishes").offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x    = rnd(0, W);
      this.y    = rnd(0, H);
      this.r    = rnd(0.5, 2.5);
      this.a    = rnd(0.3, 1);
      this.da   = rnd(0.005, 0.02) * (Math.random() < .5 ? 1 : -1);
      this.gold = Math.random() < .15;
    }
    update() {
      this.a += this.da;
      if (this.a <= 0.08 || this.a >= 1) this.da *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.gold ? `rgba(240,198,122,${this.a})` : `rgba(255,220,200,${this.a})`;
      ctx.shadowBlur  = this.r > 1.5 ? 6 : 0;
      ctx.shadowColor = this.gold ? "#f0c67a" : "#fff";
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  class ShootingStar {
    constructor() { this.active = false; this.reset(); }
    reset() {
      this.x = rnd(W * .1, W * .9); this.y = rnd(H * .05, H * .4);
      this.vx = rnd(3, 7); this.vy = rnd(1, 3);
      this.life = 0; this.maxLife = rndInt(40, 80);
      this.active = false;
    }
    activate() { this.reset(); this.active = true; }
    update() {
      if (!this.active) return;
      this.x += this.vx; this.y += this.vy; this.life++;
      if (this.life > this.maxLife) this.reset();
    }
    draw() {
      if (!this.active) return;
      const a = Math.sin((this.life / this.maxLife) * Math.PI);
      const g = ctx.createLinearGradient(this.x - this.vx * 12, this.y - this.vy * 12, this.x, this.y);
      g.addColorStop(0, "rgba(255,220,180,0)");
      g.addColorStop(1, `rgba(255,220,180,${a})`);
      ctx.beginPath();
      ctx.moveTo(this.x - this.vx * 12, this.y - this.vy * 12);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = g; ctx.lineWidth = 2;
      ctx.shadowBlur = 8; ctx.shadowColor = "#f0c67a";
      ctx.stroke(); ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < 200; i++) stars.push(new Star());
  for (let i = 0; i < 4; i++)   shots.push(new ShootingStar());

  (function maybeShoot() {
    const idle = shots.find(s => !s.active);
    if (idle) idle.activate();
    setTimeout(maybeShoot, rnd(1500, 4500));
  })();

  /* Clickable hint-stars on canvas */
  const clickStars = [];
  for (let i = 0; i < 18; i++) clickStars.push({ x: rnd(50, 1400), y: rnd(50, 600), r: rnd(5, 12), pulse: rnd(0, Math.PI * 2) });

  const starWishes = [
    "May every dream you dare to dream come true 🌙",
    "May laughter be your constant companion ✨",
    "May love find you in every unexpected moment 💕",
    "May you always feel as cherished as you truly are 🌸",
    "May your path be lit by kindness and wonder 🏮",
    "May this year bring more magic than the last ⭐",
    "May every birthday bring you closer to your true self ✦",
    "May the stars align perfectly for you, always 🌟",
    "May peace follow you through every storm 🌊",
    "May your smile keep lighting up every room 💫",
    "May you feel as loved as you truly are 💗",
    "May beauty reveal itself to you in the simplest things 🍃",
    "May this year be your most radiant chapter yet 🌸",
    "May kindness return to you a thousandfold 🤍",
    "May your story keep getting more wonderful 📖",
    "May adventures await you around every corner ✈️",
    "May you always know your own extraordinary worth 💖",
    "May the universe keep surprising you with joy 🎁",
  ];

  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    clickStars.forEach(s => {
      const dx = cx - s.x, dy = cy - s.y;
      if (Math.sqrt(dx * dx + dy * dy) < s.r * 2.8) showStarPopup(e.clientX, e.clientY, starWishes[rndInt(0, starWishes.length - 1)]);
    });
  });

  function showStarPopup(x, y, text) {
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;left:${clamp(x-120,10,window.innerWidth-260)}px;top:${clamp(y-60,10,window.innerHeight-110)}px;background:rgba(26,16,53,.93);border:1px solid rgba(240,198,122,.38);color:rgba(255,220,200,.9);font-family:'Crimson Pro',serif;font-style:italic;font-size:.95rem;padding:.8rem 1.2rem;border-radius:12px;max-width:250px;text-align:center;z-index:9999;pointer-events:none;backdrop-filter:blur(8px);box-shadow:0 8px 28px rgba(0,0,0,.4);animation:spPop .4s ease both`;
    el.textContent = text;
    if (!qs("#spPop-kf")) {
      const s = document.createElement("style"); s.id = "spPop-kf";
      s.textContent = "@keyframes spPop{0%{opacity:0;transform:scale(.7) translateY(10px)}100%{opacity:1;transform:scale(1) translateY(0)}}";
      document.head.appendChild(s);
    }
    document.body.appendChild(el);
    setTimeout(() => { el.style.transition = "opacity .5s"; el.style.opacity = "0"; setTimeout(() => el.remove(), 500); }, 2600);
  }

  /* Wish cards */
  const wishData = [
    { icon:"🌹", wish:"May your heart always be filled with the happiness you bring to others" },
    { icon:"☀️", wish:"May every sunrise remind you how precious and beautiful you are" },
    { icon:"🦋", wish:"May your dreams take flight and carry you to wonderful places" },
    { icon:"💖", wish:"May love surround you today and every day that follows" },
    { icon:"🎀", wish:"May life's sweetest surprises find their way to you this year" },
    { icon:"🌈", wish:"May every storm in your life end with colors brighter than before" },
    { icon:"🌺", wish:"May your smile never fade and your spirit never stop shining" },
    { icon:"🎇", wish:"May every moment ahead sparkle with joy, laughter, and beautiful memories" },
    { icon:"🕊️", wish:"May peace, love, and endless happiness always find a home in your heart" },
    { icon:"💫", wish:"May this new chapter of your life be even more magical than the last" },
    { icon:"🌟", wish:"May your birthday be as beautiful, rare, and unforgettable as you are" },
    { icon:"💍", wish:"May every wish you make today bring you closer to your happiest dreams" },
      ];
  const grid = qs("#wishes-grid");
  if (grid) {
    wishData.forEach((w, i) => {
      const card = document.createElement("div");
      card.className = "wish-card reveal";
      card.dataset.delay = String(i * 80);
      card.innerHTML = `<span class="wish-star">${w.icon}</span><p class="wish-num">Wish #${i+1}</p><p class="wish-text">${w.wish}</p>`;
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX-r.left)/r.width*100)+"%");
        card.style.setProperty("--my", ((e.clientY-r.top)/r.height*100)+"%");
      });
      grid.appendChild(card);
    });
    setTimeout(initReveal, 80);
  }

  /* Canvas loop */
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => { s.update(); s.draw(); });
    shots.forEach(s => { s.update(); s.draw(); });
    clickStars.forEach(s => {
      s.pulse = (s.pulse + 0.04) % (Math.PI * 2);
      const pr = s.r * (1 + Math.sin(s.pulse) * 0.3);
      ctx.beginPath(); ctx.arc(s.x, s.y, pr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(240,198,122,.48)";
      ctx.shadowBlur = 14; ctx.shadowColor = "#f0c67a";
      ctx.fill(); ctx.shadowBlur = 0;
    });
    requestAnimationFrame(loop);
  })();
})();

/* ============================================================
   REASONS I LOVE YOU
============================================================ */
(() => {
  const grid = qs("#reasons-grid");
  if (!grid) return;

  const reasons = [
  { icon:"📱", text:"Even from miles away, you're the first person I want to tell everything to" },
  { icon:"🌍", text:"You make distance feel smaller and love feel bigger" },
  { icon:"💬", text:"No conversation with you ever feels long enough" },
  { icon:"🌅", text:"You're the reason I look forward to every morning and every night" },
  { icon:"❤️", text:"You make me feel loved even when I can't hold your hand" },
  { icon:"⭐", text:"Your smile can brighten my entire day through a screen" },
  { icon:"🤍", text:"You understand me in ways no one else ever has" },
  { icon:"🎵", text:"Your voice is my favourite comfort after a long day" },
  { icon:"🫶", text:"You always make me feel important, no matter how busy life gets" },
  { icon:"🚀", text:"You inspire me to become a better version of myself every day" },
  { icon:"🏡", text:"No matter where we are, you feel like home to me" },
  { icon:"🎂", text:"Because every day with you is a gift, but today we celebrate the greatest one—you" },
  ];

  reasons.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "reason-card reveal";
    card.dataset.delay = String(i * 55);
    card.style.setProperty("--fo", i % 2 === 0 ? "-8px" : "-12px");
    card.style.animationDuration = rnd(3.5, 6) + "s";
    card.style.animationDelay    = rnd(0, 3) + "s";
    card.innerHTML = `<span class="reason-icon">${r.icon}</span><p class="reason-text">${r.text}</p>`;
    grid.appendChild(card);
  });
  setTimeout(initReveal, 80);

  /* Heart trail */
  const section = qs("#reasons");
  const htc     = qs("#heart-trail");
  if (!section || !htc) return;
  const hCtx = htc.getContext("2d");
  htc.width  = section.offsetWidth;
  htc.height = section.offsetHeight;
  const trails = [];
  let lx = 0, ly = 0;

  section.addEventListener("mousemove", e => {
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top + window.scrollY - section.offsetTop;
    if (Math.abs(x - lx) > 5 || Math.abs(y - ly) > 5) {
      trails.push({ x, y, life: 40, r: rnd(4, 10) });
      lx = x; ly = y;
    }
  });

  (function drawTrails() {
    hCtx.clearRect(0, 0, htc.width, htc.height);
    for (let i = trails.length - 1; i >= 0; i--) {
      const t = trails[i]; t.life--;
      hCtx.globalAlpha = (t.life / 40) * 0.55;
      hCtx.font = `${t.r * 2}px serif`;
      hCtx.fillStyle = "#e9849a";
      hCtx.fillText("❤", t.x, t.y);
      if (t.life <= 0) trails.splice(i, 1);
    }
    hCtx.globalAlpha = 1;
    requestAnimationFrame(drawTrails);
  })();
})();

/* ============================================================
   BIRTHDAY SURPRISE — gift + cake + confetti
============================================================ */
(() => {
  const giftWrap  = qs("#gift-wrap");
  const giftHint  = qs("#gift-hint");
  const cakeScene = qs("#cake-scene");
  const blowBtn   = qs("#blow-btn");
  const wishRes   = qs("#wish-result");
  const modal     = qs("#surprise-modal");
  const modalX    = qs("#modal-x");
  const modalOk   = qs("#modal-ok");
  const confCan   = qs("#confetti-canvas");

  if (!giftWrap) return;
  let giftOpen = false, cakeBlow = false;

  giftWrap.addEventListener("click", () => {
    if (giftOpen) return;
    giftOpen = true;
    giftWrap.classList.add("open");
    if (giftHint) { giftHint.textContent = "🎊"; giftHint.style.opacity = ".4"; giftHint.style.animation = "none"; }
    burst();
    setTimeout(() => { if (cakeScene) { cakeScene.classList.add("show"); } }, 850);
    setTimeout(() => { if (modal) modal.classList.add("active"); }, 2300);
  });

  blowBtn && blowBtn.addEventListener("click", () => {
    if (cakeBlow) return;
    cakeBlow = true;
    blowBtn.disabled = true;
    qsa(".flame").forEach((f, i) => setTimeout(() => f.classList.add("out"), i * 180));
    setTimeout(() => {
      const msgs = [
        "Your wish has been carried to the stars ⭐ May it come true!",
        "The universe heard your wish 🌙 It's already on its way!",
        "Every candle carries a dream — yours just began its journey 💕",
        "Wishes made on birthday candles always find their way home 🌸",
      ];
      if (wishRes) wishRes.textContent = msgs[rndInt(0, msgs.length - 1)];
      burst();
    }, qsa(".flame").length * 180 + 400);
  });

  [modalX, modalOk].forEach(el => el && el.addEventListener("click", () => modal.classList.remove("active")));
  modal && modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("active"); });

  /* Confetti */
  const confCtx = confCan && confCan.getContext("2d");
  let cW, cH, pieces = [], running = false;
  const COLS = ["#f7c5d5","#f0c67a","#c4b5d8","#f9c9a4","#e9849a","#fff0f5"];

  function resizeConf() {
    if (!confCan) return;
    cW = confCan.width  = window.innerWidth;
    cH = confCan.height = window.innerHeight;
  }
  resizeConf();
  window.addEventListener("resize", resizeConf, { passive: true });

  class Piece {
    constructor(x, y) {
      this.x  = x; this.y = y;
      this.vx = rnd(-8, 8); this.vy = rnd(-18, -5);
      this.g  = rnd(.3, .6); this.rot = rnd(0, Math.PI*2); this.dr = rnd(-.15, .15);
      this.w  = rnd(6, 14); this.h = rnd(3, 7);
      this.col = COLS[rndInt(0, COLS.length-1)];
      this.life = 1; this.decay = rnd(.008, .015);
    }
    update() { this.x+=this.vx; this.y+=this.vy; this.vy+=this.g; this.vx*=.99; this.rot+=this.dr; this.life-=this.decay; }
    draw() { confCtx.save();confCtx.globalAlpha=this.life;confCtx.translate(this.x,this.y);confCtx.rotate(this.rot);confCtx.fillStyle=this.col;confCtx.fillRect(-this.w/2,-this.h/2,this.w,this.h);confCtx.restore(); }
  }

  function burst() {
    if (!confCan) return;
    for (let i = 0; i < 150; i++) pieces.push(new Piece(cW/2+rnd(-100,100), cH*.4));
    if (!running) runConf();
  }
  window._burst = burst;

  function runConf() {
    running = true;
    confCtx.clearRect(0, 0, cW, cH);
    for (let i = pieces.length-1; i >= 0; i--) {
      pieces[i].update(); pieces[i].draw();
      if (pieces[i].life <= 0 || pieces[i].y > cH+50) pieces.splice(i,1);
    }
    if (pieces.length) requestAnimationFrame(runConf);
    else { running=false; confCtx.clearRect(0,0,cW,cH); }
  }
})();

/* ============================================================
   ENDING — floating lanterns + easter egg
============================================================ */
(() => {
  const canvas = qs("#lanterns-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, lanterns = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = qs("#ending").offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  class Lantern {
    constructor() { this.reset(true); }
    reset(init=false) {
      this.x  = rnd(W*.1, W*.9);
      this.y  = init ? rnd(0,H) : H+30;
      this.r  = rnd(8,18);
      this.vy = rnd(.3,.9); this.vx = rnd(-.3,.3);
      this.glow = rnd(.3,.8); this.dg = rnd(.005,.015) * (Math.random()<.5?1:-1);
      this.wb = rnd(0, Math.PI*2); this.wbs = rnd(.01,.03);
    }
    update() {
      this.y -= this.vy; this.x += this.vx + Math.sin(this.wb)*.4;
      this.wb += this.wbs; this.glow += this.dg;
      if (this.glow<=.15||this.glow>=.9) this.dg*=-1;
      if (this.y < -40) this.reset();
    }
    draw() {
      const g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*2);
      g.addColorStop(0,`rgba(255,200,80,${this.glow})`);
      g.addColorStop(.5,`rgba(255,140,40,${this.glow*.7})`);
      g.addColorStop(1,"rgba(200,80,20,0)");
      ctx.save();
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(this.x,this.y,this.r,this.r*1.4,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(this.x,this.y,this.r*.5,this.r*.7,0,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,240,180,${this.glow*.8})`; ctx.fill();
      ctx.strokeStyle = `rgba(255,200,100,${this.glow*.35})`; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.moveTo(this.x,this.y+this.r*1.4); ctx.lineTo(this.x,this.y+this.r*2); ctx.stroke();
      ctx.restore();
    }
  }

  for (let i=0;i<30;i++) lanterns.push(new Lantern());
  (function loop() { ctx.clearRect(0,0,W,H); lanterns.forEach(l=>{l.update();l.draw();}); requestAnimationFrame(loop); })();

  /* Easter egg */
  const moon       = qs("#moon");
  const easterMod  = qs("#easter-modal");
  const easterX    = qs("#easter-x");

  moon && moon.addEventListener("click", () => {
    if (easterMod) easterMod.classList.add("active");
    if (window._burst) window._burst();
  });
  easterX  && easterX.addEventListener("click",  () => easterMod.classList.remove("active"));
  easterMod && easterMod.addEventListener("click", e => { if (e.target===easterMod) easterMod.classList.remove("active"); });
})();

/* ============================================================
   AMBIENT MUSIC (Web Audio API — no files needed)
============================================================ */

(() => {
  const btn = qs("#music-btn");
  if (!btn) return;

  const audio = new Audio("music1.mp3");
  audio.loop = true;
  audio.volume = 0.3;

  // 👇 ADD THESE 2 LINES - auto play when page loads
  audio.play().catch(() => {}); // .catch() handles browser autoplay block silently
  btn.classList.add("playing");
  qs(".music-label", btn).textContent = "On";

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      btn.classList.add("playing");
      qs(".music-label", btn).textContent = "On";
    } else {
      audio.pause();
      btn.classList.remove("playing");
      qs(".music-label", btn).textContent = "Music";
    }
  });
})();

/* ============================================================
   KEYBOARD EASTER EGG — type "love"
============================================================ */
(() => {
  let buf = "";
  document.addEventListener("keydown", e => {
    buf = (buf + e.key.toLowerCase()).slice(-4);
    if (buf === "love") {
      const el = document.createElement("div");
      el.style.cssText="position:fixed;bottom:6rem;left:50%;transform:translateX(-50%);background:rgba(26,16,53,.93);color:rgba(255,220,200,.9);font-family:'Dancing Script',cursive;font-size:1.1rem;padding:.7rem 1.5rem;border-radius:50px;border:1px solid rgba(200,100,160,.35);box-shadow:0 4px 18px rgba(0,0,0,.4);z-index:99998;pointer-events:none;opacity:1;transition:opacity .6s ease .8s";
      el.textContent = '💕 "love" — the magic word 🌸';
      document.body.appendChild(el);
      setTimeout(()=>{el.style.opacity="0";setTimeout(()=>el.remove(),700);},1800);
      buf = "";
    }
  });
})();

console.log("%c🌸 Happy Birthday, My Love! 🌸","font-family:serif;font-size:18px;color:#e9849a;");
console.log("%c✦ Made with all the love in the world ✦","font-family:serif;font-size:13px;color:#f0c67a;");
