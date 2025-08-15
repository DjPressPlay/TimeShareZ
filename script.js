
// ==========================
// TimeShareZ – script.js (CORRECTED)
// ==========================

// This function will be imported and called by index.html
// It finds the tutorial HTML (once it's loaded) and makes the buttons work.
export function initTutorialOverlay() {
  const overlay = document.querySelector("#tutorial-overlay");
  if (!overlay) {
    return; // If the HTML isn't there, do nothing.
  }

  const steps = overlay.querySelectorAll(".tutorial-step");
  const nextButton = overlay.querySelector("#tz-next");
  const backButton = overlay.querySelector("#tz-back");
  const closeButton = overlay.querySelector("#tz-close");
  let currentStepIndex = 0;

  if (steps.length === 0) return;

  const showStep = (index) => {
    steps.forEach((step, idx) => {
      step.hidden = (idx !== index);
    });
  };
  const closeTutorial = () => {
    overlay.style.display = "none";
  };

  // Attach the click events to the buttons
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        showStep(currentStepIndex);
      }
    });
  }
  if (backButton) {
    backButton.addEventListener("click", () => {
      if (currentStepIndex > 0) {
        currentStepIndex--;
        showStep(currentStepIndex);
      }
    });
  }
  if (closeButton) {
    closeButton.addEventListener("click", closeTutorial);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTutorial();
    }
  });

  // Show the tutorial
  overlay.style.display = "flex";
  showStep(currentStepIndex);
}
