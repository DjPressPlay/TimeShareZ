// ==========================
// TimeShareZ – script.js
// ==========================

/**
 * Finds the tutorial overlay component in the DOM and makes it interactive.
 */
function initTutorialOverlay() {
  // Find the main tutorial container by its ID.
  const overlay = document.querySelector("#tutorial-overlay");
  
  // If the overlay doesn't exist on the page, stop the function.
  if (!overlay) {
    console.warn("Could not initialize tutorial: element with ID '#tutorial-overlay' not found.");
    return;
  }

  // Find all the interactive parts inside the overlay.
  const steps = overlay.querySelectorAll(".tutorial-step");
  const nextButton = overlay.querySelector("#tz-next");
  const backButton = overlay.querySelector("#tz-back");
  const closeButton = overlay.querySelector("#tz-close");
  let currentStepIndex = 0;

  if (steps.length === 0) return; // Exit if there are no steps.

  const showStep = (index) => {
    steps.forEach((step, idx) => {
      step.hidden = (idx !== index);
    });
  };

  const closeTutorial = () => {
    overlay.style.display = "none";
  };

  // --- Attach Event Listeners ---

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

  // Allow closing with the 'Escape' key.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTutorial();
    }
  });

  // --- Set Initial State ---
  
  // Make the overlay visible.
  overlay.style.display = "flex"; 
  // Show the first step.
  showStep(currentStepIndex);   
}

// Export the function so index.html can import and use it.
export { initTutorialOverlay };
