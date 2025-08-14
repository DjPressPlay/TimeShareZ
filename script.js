// ==========================
// TimeShareZ – script.js
// ==========================

// Components to load (HTML fragments in /components)
const components = [
  "top-bar",
  "funded-feed",
  "hot-feed",
  "main-rotator",
  "tutorial-overlay",
  "footer"
];

let sessionData = null;
let topBarReady = false;

// ---------- DOM helpers ----------
function qs(id) {
  return document.getElementById(id);
}

function setSessionUI({ state, number }) {
  const el = qs("sessionDisplay");
  const retry = qs("sessionActionBtn");
  if (!el) return;

  // Reset classes
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

  // error
  el.textContent = "Session: Failed";
  el.classList.add("is-error");
  if (retry) retry.hidden = false;
}

// ---------- Top Bar wiring ----------
function wireTopBar() {
  topBarReady = true;

  // Ensure we always show *something* immediately
  setSessionUI({ state: "loading" });

  // If session already resolved, render it
  if (sessionData && sessionData.session_number) {
    setSessionUI({ state: "ready", number: sessionData.session_number });
  }

  // Retry button
  const retry = qs("sessionActionBtn");
  if (retry) {
    retry.addEventListener("click", async () => {
      try {
        setSessionUI({ state: "loading" });
        const { default: SessionManager } = await import("./sessionManager.js");
        sessionData = await SessionManager.createSession();
        if (!sessionData || !sessionData.session_number) throw new Error("No session returned");
        setSessionUI({ state: "ready", number: sessionData.session_number });
        console.log("[TSZ] Retry created session:", sessionData);
      } catch (err) {
        console.error("[TSZ] Retry failed:", err);
        setSessionUI({ state: "error" });
      }
    });
  }

  // React to async session events
  document.addEventListener("tsz:session-ready", (e) => {
    const n = e.detail?.session_number;
    if (n) setSessionUI({ state: "ready", number: n });
  });

  document.addEventListener("tsz:session-error", () => {
    setSessionUI({ state: "error" });
  });
}

// ---------- Components loader ----------
async function loadComponents() {
  console.log("[TSZ] Loading components:", components);
  const root = document.getElementById("app-root");

  for (const name of components) {
    try {
      const res = await fetch(`components/${name}.html`);
      if (!res.ok) throw new Error(`Failed to load ${name}`);
      const html = await res.text();
      root.insertAdjacentHTML("beforeend", html);
      console.log(`[TSZ] Loaded component: ${name}`);

      if (name === "top-bar") {
        console.log("[TSZ] top-bar loaded, wiring UI");
        wireTopBar();
      }
    } catch (err) {
      console.error(`Error loading ${name}.html`, err);
    }
  }

  initTutorialOverlay();
}

// ---------- Tutorial overlay ----------
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
// 1) Kick off session creation *immediately* (before components load)
(async () => {
  console.log("[TSZ] script.js loaded - starting session init");
  try {
    const { default: SessionManager } = await import("./sessionManager.js");
    console.log("[TSZ] SessionManager loaded, calling getOrCreateSession()");
    sessionData = await SessionManager.getOrCreateSession();

    if (!sessionData || !sessionData.session_number) {
      throw new Error("No session_number in response");
    }

    console.log("[TSZ] Session ready at page load:", sessionData);

    // If top bar is already mounted, update instantly
    if (topBarReady) {
      setSessionUI({ state: "ready", number: sessionData.session_number });
    }

    // Always broadcast resolution (in case components arrive later)
    document.dispatchEvent(
      new CustomEvent("tsz:session-ready", { detail: { session_number: sessionData.session_number } })
    );
  } catch (err) {
    console.error("[TSZ] Failed to init session at startup:", err);

    if (topBarReady) setSessionUI({ state: "error" });
    document.dispatchEvent(new CustomEvent("tsz:session-error"));
  }
})();

// 2) Load components; when top bar mounts it will render current state
loadComponents();
