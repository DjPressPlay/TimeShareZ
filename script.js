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
      if (!res.ok) throw new Error();
      root.insertAdjacentHTML("beforeend", await res.text());
    } catch (err) {
      console.error(`Error loading ${name}.html`);
    }
  }

  // Init after all components are loaded
  initTutorialOverlay();
  initSessionDisplay();
}

function initTutorialOverlay() {
  const overlay = document.getElementById("tz-tutorial");
  if (!overlay) return;

  const steps = overlay.querySelectorAll(".tutorial-step");
  let i = 0;

  const showStep = (n) => steps.forEach((s, idx) => s.hidden = idx !== n);
  const close = () => overlay.style.display = "none";

  overlay.querySelector("#tz-next")?.addEventListener("click", () => { if (i < steps.length - 1) showStep(++i); });
  overlay.querySelector("#tz-back")?.addEventListener("click", () => { if (i > 0) showStep(--i); });
  overlay.querySelector("#tz-close")?.addEventListener("click", close);
  document.addEventListener("keydown", (e) => e.key === "Escape" && close());

  overlay.style.display = "flex";
  overlay.hidden = false;
  showStep(0);
}

// Independent session display init
function initSessionDisplay() {
  import("./sessionManager.js").then(SessionManagerModule => {
    const SessionManager = SessionManagerModule.default;
    const { sessionNumber } = SessionManager.getOrCreateSession();

    const sessionEl = document.getElementById("sessionDisplay");
    if (sessionEl) {
      sessionEl.textContent = `Session: ${sessionNumber}`;
    } else {
      console.warn("Session display element not found in DOM.");
    }
  }).catch(err => {
    console.error("Failed to load sessionManager.js", err);
  });
}

loadComponents();
