// ==========================
// TimeShareZ – script.js (Corrected)
// ==========================

function initTutorialOverlay() {
  // UPDATED: Changed the selector to find the div by its ID.
  // The '#' symbol is used to select elements by their ID.
  const overlay = document.querySelector("#tutorial-overlay");
  
  if (!overlay) {
    // This warning will no longer appear if the file loads correctly.
    console.warn("Tutorial overlay component ('#tutorial-overlay') not found in the DOM.");
    return;
  }

  // The rest of the code works perfectly as it searches within the found overlay.
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

  // --- Event Listeners ---

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

  // --- Initial State ---
  
  overlay.style.display = "flex"; 
  showStep(currentStepIndex);   
}

export { initTutorialOverlay };
