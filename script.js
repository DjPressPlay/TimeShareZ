// ==========================
// TimeShareZ – script.js (Rewritten for clarity and debugging)
// ==========================

// This function will be exported and called by index.html after components are loaded.
function initTutorialOverlay() {
  console.log("[Tutorial] initTutorialOverlay() function has been called.");

  // Step 1: Find the main tutorial component on the page.
  const overlay = document.querySelector("tz-tutorial");

  // Step 2: Check if the component was actually found. This is a critical failure point.
  if (!overlay) {
    console.error("[Tutorial] CRITICAL: Could not find the <tz-tutorial> element in the DOM. Ensure tutorial-overlay.html was loaded correctly.");
    return; // Stop the function if the main container is missing.
  }

  console.log("[Tutorial] Successfully found the <tz-tutorial> component.", overlay);

  // Step 3: Find all the interactive parts inside the component.
  const steps = overlay.querySelectorAll(".tutorial-step");
  const nextButton = overlay.querySelector("#tz-next");
  const backButton = overlay.querySelector("#tz-back");
  const closeButton = overlay.querySelector("#tz-close");
  let currentStepIndex = 0;

  // Step 4: Check if we have steps to show.
  if (steps.length === 0) {
    console.warn("[Tutorial] No '.tutorial-step' elements were found inside the overlay.");
    return; // Nothing to do if there are no steps.
  }

  console.log(`[Tutorial] Found ${steps.length} tutorial steps.`);

  // --- Helper Functions ---

  /**
   * Manages which step is currently visible.
   * @param {number} index The index of the step to display.
   */
  const showStep = (index) => {
    console.log(`[Tutorial] Showing step ${index}.`);
    steps.forEach((step, idx) => {
      // Use the 'hidden' attribute for showing/hiding. It's clean and good for accessibility.
      step.hidden = (idx !== index);
    });
  };

  /**
   * Hides the entire tutorial overlay from view.
   */
  const closeTutorial = () => {
    console.log("[Tutorial] Closing overlay.");
    overlay.style.display = "none";
  };

  // --- Event Listener Setup ---

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        showStep(currentStepIndex);
      }
    });
  } else {
    console.warn("[Tutorial] Next button (#tz-next) not found.");
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      if (currentStepIndex > 0) {
        currentStepIndex--;
        showStep(currentStepIndex);
      }
    });
  } else {
    console.warn("[Tutorial] Back button (#tz-back) not found.");
  }
  
  if (closeButton) {
    closeButton.addEventListener("click", closeTutorial);
  } else {
    console.warn("[Tutorial] Close button (#tz-close) not found.");
  }

  // Add a global listener to close the tutorial with the Escape key.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTutorial();
    }
  });

  // --- Final Initialization ---

  console.log("[Tutorial] Initialization complete. Making overlay visible now.");
  
  // Set the display style to make the overlay visible.
  overlay.style.display = "flex"; 
  
  // Show the very first step.
  showStep(currentStepIndex);   
}

// Export the function so it can be imported and used by index.html
export { initTutorialOverlay };
