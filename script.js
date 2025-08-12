console.log("TimeShareZ is live 🚀");

// ========================
// Tutorial Overlay Logic
// ========================
(function initTutorialOverlay() {
  const overlay = document.getElementById("tz-tutorial");
  if (!overlay) {
    console.warn("Tutorial overlay not found in DOM.");
    return;
  }

  const steps = overlay.querySelectorAll(".tutorial-step");
  let currentStepIndex = 0;

  const nextBtn = document.getElementById("tz-next");
  const backBtn = document.getElementById("tz-back");
  const closeBtn = document.getElementById("tz-close");

  // Show a given step index
  function showStep(index) {
    steps.forEach((step, i) => {
      step.hidden = i !== index;
    });
    currentStepIndex = index;
  }

  // Show overlay on load
  function openOverlay() {
    overlay.style.display = "flex";
    overlay.hidden = false;
    showStep(0);
  }

  // Hide overlay
  function closeOverlay() {
    overlay.style.display = "none";
  }

  // Event bindings
  nextBtn?.addEventListener("click", () => {
    if (currentStepIndex < steps.length - 1) {
      showStep(currentStepIndex + 1);
    }
  });

  backBtn?.addEventListener("click", () => {
    if (currentStepIndex > 0) {
      showStep(currentStepIndex - 1);
    }
  });

  closeBtn?.addEventListener("click", closeOverlay);

  // ESC key closes overlay
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlay();
  });

  // Auto-open tutorial on page load
  openOverlay();
})();
