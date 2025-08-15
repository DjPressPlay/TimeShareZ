// ==========================
// TimeShareZ – script.js (No changes needed)
// ==========================

let sessionData = null; 

function initTutorialOverlay() {
  // This line searches the page for the <tz-tutorial> tag that was loaded from tutorial-overlay.html
  const overlay = document.querySelector("tz-tutorial");
  
  if (!overlay) {
    console.warn("Tutorial overlay component ('tz-tutorial') not found in the DOM.");
    return;
  }

  // These lines search *inside* the found overlay for its parts
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
  
  // This makes the entire <tz-tutorial> component visible
  overlay.style.display = "flex"; 
  // This shows the first .tutorial-step inside it
  showStep(currentStepIndex);   
}

export { initTutorialOverlay };
