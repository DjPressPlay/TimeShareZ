// ==========================
// TimeShareZ – script.js
// ==========================

let sessionData = null;
let topBarReady = false;

function qs(id) {
  return document.getElementById(id);
}

function setSessionUI(sessionId) {
  const el = qs("sessionDisplay");
  if (!el) return;
  el.textContent = sessionId || "";
}

function wireTopBar() {
  topBarReady = true;

  // Show immediately if we already have it
  if (sessionData?.session_id) {
    setSessionUI(sessionData.session_id);
  } else {
    // Update when the session becomes available
    document.addEventListener("tsz:session-ready", (e) => {
      const id = e.detail?.session_id;
      if (id) setSessionUI(id);
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
