// Components to load
const components = [
  "top-bar",
  "funded-feed",
  "hot-feed",
  "main-rotator",
  "tutorial-overlay",
  "footer"
];

async function loadComponents() {
  const root = document.getElementById("app-root");

  for (const name of components) {
    try {
      const res = await fetch(`components/${name}.html`);
      if (!res.ok) throw new Error(`Failed to load ${name}`);
      root.insertAdjacentHTML("beforeend", await res.text());

      // ✅ Only run session init once top-bar is fully in DOM
      if (name === "top-bar") {
        await initSessionDisplay();
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

// ✅ Ensure Supabase session is created/fetched
async function initSessionDisplay() {
  try {
    const SessionManagerModule = await import("./sessionManager.js");
    const SessionManager = SessionManagerModule.default;

    // Always create or fetch from backend
    const sessionData = await SessionManager.getOrCreateSession();
    if (!sessionData) {
      console.error("Failed to get or create session");
      return;
    }

    const { session_number } = sessionData;

    const sessionEl = document.getElementById("sessionDisplay");
    if (sessionEl) {
      sessionEl.textContent = `Session: ${session_number}`;
    } else {
      console.warn("Session display element not found in DOM.");
    }
  } catch (err) {
    console.error("Session init failed:", err);
  }
}

loadComponents();
