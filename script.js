// ==========================
// TimeShareZ – script.js
// ==========================

let sessionData = null;
let topBarReady = false;

/**
 * Shortcut for document.getElementById
 */
function qs(id) {
  return document.getElementById(id);
}

/**
 * Update the session display UI
 */
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

/**
 * Wire up the top bar session handling
 */
function wireTopBar() {
  topBarReady = true;
  setSessionUI({ state: "loading" });

  // If session was already resolved before top bar mounted
  if (sessionData && sessionData.session_number) {
    setSessionUI({ state: "ready", number: sessionData.session_number });
  }

  // Retry button creates a new session on demand
  const retry = qs("sessionActionBtn");
  if (retry) {
    retry.addEventListener("click", async () => {
      try {
        setSessionUI({ state: "loading" });
        const { default: SessionManager } = await import("./sessionManager.js");
        sessionData = await SessionManager.createSession();
        if (!sessionData || !sessionData.session_number) {
          throw new Error("No session returned");
        }
        setSessionUI({ state: "ready", number: sessionData.session_number });
        console.log("[TSZ] Retry created session:", sessionData);
      } catch (err) {
        console.error("[TSZ] Retry failed:", err);
        setSessionUI({ state: "error" });
      }
    });
  }

  // Respond to global session events fired by index loader flow
  document.addEventListener("tsz:session-ready", (e) => {
    const n = e.detail?.session_number;
    if (n) setSessionUI({ state: "ready", number: n });
  });

  document.addEventListener("tsz:session-error", () => {
    setSessionUI({ state: "error" });
  });
}

/**
 * Initialize the tutorial overlay
 */
function initTutorialOverlay() {
  const overlay = qs("tz-tutorial");
  if (!overlay) return;

  const steps = overlay.querySelectorAll(".tutorial-step");
  let i = 0;

  const showStep = (n) => {
    steps.forEach((s, idx) => {
      s.hidden = idx !== n;
    });
  };

  const close = () => {
    overlay.style.display = "none";
  };

  overlay.querySelector("#tz-next")?.addEventListener("click", () => {
    if (i < steps.length - 1) showStep(++i);
  });

  overlay.querySelector("#tz-back")?.addEventListener("click", () => {
    if (i > 0) showStep(--i);
  });

  overlay.querySelector("#tz-close")?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  overlay.style.display = "flex";
  overlay.hidden = false;
  showStep(0);
}

// No session bootstrap here.
// Index will import SessionManager, call getOrCreateSession(),
// then dispatch events so this file can update UI.

export { wireTopBar, initTutorialOverlay };
