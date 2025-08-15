// ==========================
// TimeShareZ – script.js
// ==========================

// This variable is declared but not used. It can be removed if not needed elsewhere.
let sessionData = null; 

/**
 * Initializes the tutorial overlay functionality.
 * Finds the overlay and hooks up event listeners to the navigation buttons.
 */
function initTutorialOverlay() {
  // FIX: Replaced the undefined 'qs' function with the standard 'document.querySelector'.
  // We are selecting the element with the tag name 'tz-tutorial'.
  const overlay = document.querySelector("tz-tutorial");
  
  // If the overlay component isn't on the page for any reason, stop the function.
  if (!overlay) {
    console.warn("Tutorial overlay component ('tz-tutorial') not found in the DOM.");
    return;
  }

  const steps = overlay.querySelectorAll(".tutorial-step");
  const nextButton = overlay.querySelector("#tz-next");
  const backButton = overlay.querySelector("#tz-back");
  const closeButton = overlay.querySelector("#tz-close");
  let currentStepIndex = 0;

  // If there are no steps, there's nothing to do.
  if (steps.length === 0) return;

  /**
   * Hides all steps except for the one at the specified index.
   * @param {number} index - The index of the step to show.
   */
  const showStep = (index) => {
    steps.forEach((step, idx) => {
      // Use the hidden attribute for accessibility. True hides, false shows.
      step.hidden = (idx !== index);
    });
  };

  /**
   * Hides the entire tutorial overlay.
   */
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

  // Allow closing the tutorial with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTutorial();
    }
  });

  // --- Initial State ---
  
  // Start the tutorial
  overlay.style.display = "flex"; // Show the overlay container
  showStep(currentStepIndex);   // Show the first step
}

// Export the function so it can be imported in index.html
export { initTutorialOverlay };
