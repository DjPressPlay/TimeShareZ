// Components to load
const components = [
  "top-bar",
  "funded-feed",
  "hot-feed",
  "main-rotator",
  "tutorial-overlay",
  "footer"
];

let sessionData = null;

// 🔹 Create/fetch session immediately on load
(async () => {
  console.log("[TSZ] script.js loaded - starting session init");
  try {
    const { default: SessionManager } = await import("./sessionManager.js");
    console.log("[TSZ] SessionManager loaded, calling getOrCreateSession()");
    sessionData = await SessionManager.getOrCreateSession();
    console.log("[TSZ] Session ready at page load:", sessionData);
  } catch (err) {
    console.error("[TSZ] Failed to init session at startup:", err);
  }
})();

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

      // When top-bar is loaded, update its display if we already have session data
      if (name === "top-bar") {
        console.log("[TSZ] top-bar loaded, initializing session display");
        initSessionDisplay();
      }
    } catch (err) {
      console.error(`Error loading ${name}.html`, err);
    }
  }

  initTutorialOverlay();
}

function initTutorialOverlay() {
  const overlay = document.getElementById("tz-tutorial");
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

function initSessionDisplay() {
  const sessionEl = document.getElementById("sessionDisplay");
  if (!sessionEl) {
    console.warn("[TSZ] Session display element not found in DOM.");
    return;
  }
  if (sessionData) {
    sessionEl.textContent = `Session: ${sessionData.session_number}`;
    console.log("[TSZ] Updated top-bar session display:", sessionData.session_number);
  } else {
    sessionEl.textContent = "Session: ERROR";
    console.warn("[TSZ] No session data available for display");
  }
}

loadComponents();
