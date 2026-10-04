// Clips play in black and white, and turn to color while they hold your attention.
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clips = [...document.querySelectorAll(".clip")].filter((c) => c.querySelector("video"));
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
  document.querySelectorAll(".clip--still").forEach((c) => liveIO.observe(c));
})();

// YouTube facades: show a thumbnail, load the player only when clicked.
document.querySelectorAll(".yt").forEach((btn) => {
  btn.addEventListener("click", () => {
    const f = document.createElement("iframe");
    const start = btn.dataset.start ? `&start=${btn.dataset.start}` : "";
    f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0${start}`;
    f.title = btn.getAttribute("aria-label").replace("Play video: ", "");
    f.className = "yt-frame";
    f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    btn.replaceWith(f);
    f.focus();
  });
});
