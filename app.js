(() => {
  const bar = document.querySelector(".bar"), journey = document.querySelector(".journey");
  const pan = document.querySelector(".pan"), steps = [...document.querySelectorAll(".jstep")], fill = document.querySelector(".rail i");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let busy = false;
  const update = () => {
    busy = false;
    bar?.classList.toggle("on", scrollY > 30);
    if (!journey) return;
    const r = journey.getBoundingClientRect(), total = Math.max(1, journey.offsetHeight - innerHeight);
    const p = Math.min(1, Math.max(0, -r.top / total));
    if (!reduce && pan) {
      const range = Math.max(0, pan.offsetWidth - innerWidth);
      pan.style.transform = `translate3d(${-p * range}px,0,0)`;
    }
    if (fill) fill.style.transform = `scaleX(${p})`;
    const i = Math.min(steps.length - 1, Math.floor(p * steps.length));
    steps.forEach((s, k) => s.classList.toggle("on", k === i));
  };
  addEventListener("scroll", () => { if (!busy) { busy = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  pan?.addEventListener("load", update);
  update();
})();
