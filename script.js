// ==========================
// TimeShareZ – script.js (Corrected with better UX)
// ==========================

export function initTutorialOverlay() {
  const overlay = document.querySelector("#tutorial-overlay");
  if (!overlay) { return; }

  const steps = overlay.querySelectorAll(".tutorial-step");
  const nextButton = overlay.querySelector("#tz-next");
  const backButton = overlay.querySelector("#tz-back");
  const closeButton = overlay.querySelector("#tz-close");
  let currentStepIndex = 0;

  if (steps.length === 0) return;

  /**
   * NEW AND IMPROVED: This function now manages the entire state of the tutorial,
   * including which step is visible and what the buttons should look like.
   * @param {number} index - The step number to display.
   */
  const showStep = (index) => {
    // Update the global index
    currentStepIndex = index;

    // Show the correct step panel
    steps.forEach((step, idx) => {
      step.hidden = (idx !== index);
    });

    // --- UX IMPROVEMENT LOGIC ---

    // 1. Hide the "Back" button on the very first step.
    backButton.style.visibility = (index === 0) ? 'hidden' : 'visible';

    // 2. On the last step, change "Next" to "Finish". Otherwise, ensure it says "Next".
    if (index === steps.length - 1) {
      nextButton.textContent = 'Finish';
    } else {
      nextButton.textContent = 'Next';
    }
  };

  const closeTutorial = () => {
    overlay.style.display = "none";
  };

  // Attach the click events to the buttons
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      // If we are NOT on the last step, go forward.
      if (currentStepIndex < steps.length - 1) {
        showStep(currentStepIndex + 1);
      } else {
        // If we ARE on the last step, the "Finish" button now closes the tutorial.
        closeTutorial();
      }
    });
  }
  if (backButton) {
    backButton.addEventListener("click", () => {
      // Go back to the previous step.
      if (currentStepIndex > 0) {
        showStep(currentStepIndex - 1);
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

  // Show the tutorial and set the initial state for step 0.
  overlay.style.display = "flex";
  showStep(0);
}
