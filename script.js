// ==========================
// TimeShareZ – script.js
// ==========================

let sessionData = null;

function qs(id) {
  return document.getElementById(id);
}

function setSessionUI({ state, number }) {
  const el = qs("sessionDisplay");
  const retry = qs("sessionActionBtn");
  if (!el) return;

  el.classList.remove("is-loading", "is-error");

  if (state === "loading") {
    el.textContent = "Session: Loading…";
    el.classList.add("is-loading");
    if (retry) retry.hidden = true;
    return;
  }

  if (state === "ready") {
    el.textContent = `Session: ${number}`;
    if (retry) retry.hidden = true;
    return;
  }

  // error state
  el.textContent = "Session: Failed";
  el.classList.add("is-error");
  if (retry) retry.hidden = false;
}

function initTutorialOverlay() {
  const overlay = qs("tz-tutorial");
  if (!overlay) return;

  const steps = overlay.querySelectorAll(".tutorial-step");
  let i = 0;

  const showStep = (n) => steps.forEach((s, idx) => (s.hidden = idx !== n));
  const close = () => (overlay.style.display = "none");

  overlay.querySelector("#tz-next")?.addEventListener("click", () => {
    if (i < steps.length - 1) showStep(++i);
  });
  overlay.querySelector("#tz-back")?.addEventListener("click", () => {
    if (i > 0) showStep(--i);
  });
  overlay.querySelector("#tz-close")?.addEventListener("click", close);
  document.addEventListener("keydown", (e) => e.key === "Escape" && close());

  overlay.style.display = "flex";
  overlay.hidden = false;
  showStep(0);
}

export { initTutorialOverlay };
