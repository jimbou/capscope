document.addEventListener("DOMContentLoaded", () => {
  const progress = document.getElementById("scroll-progress");
  const updateProgress = () => {
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    if (progress) {
      progress.style.width = max > 0 ? `${(root.scrollTop / max) * 100}%` : "0%";
    }
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  const copyButton = document.getElementById("copy-cite");
  const citation = document.getElementById("bibtex");
  copyButton?.addEventListener("click", async () => {
    const originalLabel = copyButton.textContent;
    const text = citation?.innerText ?? "";
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.append(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      copyButton.textContent = "Copied";
    } catch {
      copyButton.textContent = "Copy unavailable";
    }
    window.setTimeout(() => {
      copyButton.textContent = originalLabel;
    }, 1800);
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

  revealTargets.forEach((element) => observer.observe(element));
  window.setTimeout(() => {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }, 2200);
});
