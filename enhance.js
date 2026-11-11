/* LynoraLink — animations avancées (aucune dépendance) */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Barre de progression + en-tête condensé + lien actif */
  const bar = Object.assign(document.createElement("div"), { className: "scroll-progress" });
  document.body.prepend(bar);
  const header = document.querySelector(".site-header");
  const links = $(".nav-links a[href^='#']");
  const targets = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  let ticking = false;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    header?.classList.toggle("is-scrolled", scrollY > 40);
    const y = scrollY + innerHeight * 0.35;
    links.forEach((a, i) => a.classList.toggle("is-current", targets[i] && targets[i].offsetTop <= y && targets[i].offsetTop + targets[i].offsetHeight > y));
    const img = document.querySelector(".hero-image");
    if (img && !reduce && scrollY < innerHeight) img.style.translate = `0 ${scrollY * 0.18}px`;
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  if (reduce) return;

  /* Révélations échelonnées */
  const groups = [".steps-grid", ".maker-grid", ".features-grid", ".audience-grid", ".community-points"];
  groups.forEach(g => $(g + " > *").forEach((el, i) => { el.classList.add("js-reveal"); el.style.setProperty("--i", i); }));
  $(".section-intro, .makers-heading, .carousel-heading, .features-heading, .community-copy, .community-audience > h3, .community-next, .faq-content, .final-cta").forEach(el => el.classList.add("js-reveal"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: .15, rootMargin: "0px 0px -6% 0px" });
  $(".js-reveal").forEach(el => io.observe(el));

  /* Cartes : inclinaison 3D + halo */
  if (matchMedia("(hover:hover)").matches) {
    $(".maker-card, .feature, .audience-grid article, .step").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty("--mx", x + "px"); card.style.setProperty("--my", y + "px");
        card.style.transform = `perspective(900px) rotateX(${((y / r.height) - .5) * -6}deg) rotateY(${((x / r.width) - .5) * 7}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
    /* Boutons magnétiques */
    $(".button, .nav-join").forEach(b => {
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`; });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
    /* Halo suivant le curseur */
    const glow = Object.assign(document.createElement("div"), { className: "cursor-glow" });
    document.body.append(glow);
    let gx = 0, gy = 0, tx = 0, ty = 0;
    addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; glow.classList.add("on"); });
    (function loop() { gx += (tx - gx) * .12; gy += (ty - gy) * .12; glow.style.transform = `translate(${gx}px,${gy}px)`; requestAnimationFrame(loop); })();
  }

  /* Compteurs de défilement dans le hero : particules reliées (réseau = Link) */
  const hero = document.querySelector(".hero");
  if (hero) {
    const c = Object.assign(document.createElement("canvas"), { id: "fx-canvas" });
    hero.prepend(c);
    const ctx = c.getContext("2d");
    let w, h, dpr, pts = [], mouse = { x: -999, y: -999 }, visible = true;
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.round(w * h / 20000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .8 }));
    };
    size(); addEventListener("resize", size);
    hero.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
    const D = 130;
    (function frame() {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < D) { ctx.strokeStyle = `rgba(105,223,207,${(1 - d / D) * .35})`; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < 170) { ctx.strokeStyle = `rgba(142,197,255,${(1 - dm / 170) * .6})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
        ctx.fillStyle = "rgba(190,235,255,.85)"; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
      }
    })();
  }
})();
