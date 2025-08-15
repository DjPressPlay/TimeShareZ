// ==========================
// TimeShareZ – script.js
// ==========================

let sessionData = null;
let topBarReady = false;

function qs(id) {
  return document.getElementById(id);
}

function setSessionUI(number) {
  const el = qs("sessionDisplay");
  const retry = qs("sessionActionBtn");
  if (!el) return;

  el.classList.remove("is-loading", "is-error");
  el.textContent = `Session: ${number || "???"}`;
  if (retry) retry.hidden = true;
}

function wireTopBar() {
  topBarReady = true;

  // Immediately display whatever we have
  if (sessionData?.session_number) {
    setSessionUI(sessionData.session_number);
  } else {
    // If session comes later, still update instantly
    document.addEventListener("tsz:session-ready", (e) => {
      const n = e.detail?.session_number;
      if (n) setSessionUI(n);
    });
  }
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

export { wireTopBar, initTutorialOverlay };
