console.log("TimeShareZ containers ready to populate 🚀");

// Tutorial Overlay Logic
(function tutorialOverlay() {
  const overlay = document.getElementById("tz-tutorial");
  const step1 = overlay?.querySelector('[data-step="1"]');
  const step2 = overlay?.querySelector('[data-step="2"]');
  const nextBtn = document.getElementById("tz-next");
  const backBtn = document.getElementById("tz-back");
  const closeBtn = document.getElementById("tz-close");

  if (!overlay || !step1 || !step2) return;

  // Remove hidden and display overlay on load
  overlay.hidden = false;
  overlay.style.display = "flex";

  // Show a specific step
  function showStep(stepNumber) {
    step1.hidden = (stepNumber !== 1);
    step2.hidden = (stepNumber !== 2);
  }

  // Event Listeners
  nextBtn?.addEventListener("click", () => showStep(2));
  backBtn?.addEventListener("click", () => showStep(1));
  closeBtn?.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  // ESC key closes overlay
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      overlay.style.display = "none";
    }
  });
})();
