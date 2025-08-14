// ==========================
// TimeShareZ – script.js
// ==========================

let sessionData = null;
let topBarReady = false;

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

  el.textContent = "Session: Failed";
  el.classList.add("is-error");
  if (retry) retry.hidden = false;
}

function wireTopBar() {
  topBarReady = true;
  setSessionUI({ state: "loading" });

  if (sessionData && sessionData.session_number) {
    setSessionUI({ state: "ready", number: sessionData.session_number });
  }

  const retry = qs("sessionActionBtn");
  if (retry) {
    retry.addEventListener("click", async () => {
      try {
        setSessionUI({ state: "loading" });
        const { default: SessionManager } = await import("./sessionManager.js");
        sessionData = await SessionManager.createSession();
        if (!sessionData || !sessionData.session_number) throw new Error("No session returned");
        setSessionUI({ state: "ready", number: sessionData.session_number });
      } catch (err) {
        console.error("[TSZ] Retry failed:", err);
        setSessionUI({ state: "error" });
      }
    });
  }

  document.addEventListener("tsz:session-ready", (e) => {
    const n = e.detail?.session_number;
    if (n) setSessionUI({ state: "ready", number: n });
  });

  document.addEventListener("tsz:session-error", () => {
    setSessionUI({ state: "error" });
  });
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

// ---------- Session bootstrap ----------
(async () => {
  try {
    const { default: SessionManager } = await import("./sessionManager.js");
    sessionData = await SessionManager.getOrCreateSession();

    if (!sessionData || !sessionData.session_number) throw new Error("No session_number in response");

    if (topBarReady) {
      setSessionUI({ state: "ready", number: sessionData.session_number });
    }

    document.dispatchEvent(
      new CustomEvent("tsz:session-ready", { detail: { session_number: sessionData.session_number } })
    );
  } catch (err) {
    console.error("[TSZ] Failed to init session at startup:", err);
    if (topBarReady) setSessionUI({ state: "error" });
    document.dispatchEvent(new CustomEvent("tsz:session-error"));
  }
})();

// Make these available so index.html can call them
export { wireTopBar, initTutorialOverlay };
