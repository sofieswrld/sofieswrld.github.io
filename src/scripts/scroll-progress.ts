const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");

if (progress) {
  let frame = 0;

  const updateProgress = () => {
    frame = 0;

    const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollableDistance > 0 ? window.scrollY / scrollableDistance : 0;
    progress.style.setProperty("--scroll-progress", String(Math.min(Math.max(ratio, 0), 1)));
  };

  const requestProgressUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(updateProgress);
  };

  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate);
  updateProgress();
}
