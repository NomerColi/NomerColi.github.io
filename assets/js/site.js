// Clips play in black and white, and turn to color while they hold your attention.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clips = [...document.querySelectorAll(".clip")];
  const hero = document.querySelector(".titlecard__bg");

  if (reduce && hero) { hero.pause(); hero.removeAttribute("autoplay"); }

  // Tap or click a clip to play or pause it, with keyboard support.
  clips.forEach((clip) => {
    const v = clip.querySelector("video");
    v.setAttribute("tabindex", "0");
    const toggle = () => (v.paused ? v.play().catch(() => {}) : v.pause());
    v.addEventListener("click", toggle);
    v.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); }
    });
  });

  if (reduce || !("IntersectionObserver" in window)) return;

  // Load and play only the clips on screen.
  const playIO = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const v = target.querySelector("video");
      if (isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); }
      else v.pause();
    });
  }, { rootMargin: "200px 0px" });

  // Color comes in when a clip reaches the middle band of the screen.
  const liveIO = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => target.classList.toggle("is-live", isIntersecting));
  }, { rootMargin: "-35% 0px -35% 0px" });

  clips.forEach((c) => { playIO.observe(c); liveIO.observe(c); });
})();
