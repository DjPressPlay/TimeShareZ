<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TimeShareZ</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <!-- The main container where all dynamic components will be injected. -->
  <div class="app-container" id="app-root"></div>

  <script type="module">
    // Import the required functions from our JavaScript files.
    import { initTutorialOverlay } from './script.js';
    import SessionManager from './sessionManager.js';

    // This array tells our script which HTML files to load from the 'components' folder.
    // The name "tutorial-overlay" here correctly matches the filename "tutorial-overlay.html".
    const components = [
      "top-bar",
      "funded-feed",
      "hot-feed",
      "main-rotator",
      "tutorial-overlay", // This line correctly points to the component file.
      "footer"
    ];

    /**
     * Loads all component HTML files and injects them into the page.
     * Returns true on success, false if any file fails to load.
     */
    async function loadComponents() {
      const root = document.getElementById("app-root");
      try {
        // Fetch all components simultaneously for faster loading.
        const responses = await Promise.all(
          components.map(name => fetch(`components/${name}.html`))
        );

        for (const res of responses) {
          if (!res.ok) {
            // If a file is not found (404) or another error occurs, stop the process.
            throw new Error(`Failed to load component: ${res.url} (Status: ${res.status})`);
          }
          const html = await res.text();
          root.insertAdjacentHTML("beforeend", html);
        }
        return true; // All components loaded successfully.
      } catch (error) {
        console.error("CRITICAL ERROR DURING COMPONENT LOADING:", error);
        root.innerHTML = `<p style="color:red; text-align:center;">A critical part of the application failed to load. Please refresh.</p>`;
        return false; // Loading failed.
      }
    }

    /**
     * Main function to orchestrate the application's startup sequence.
     */
    async function initializeApp() {
      // Step 1: Load all the visual components and wait for completion.
      const loadedSuccessfully = await loadComponents();

      // Step 2: If loading failed, halt initialization to prevent further errors.
      if (!loadedSuccessfully) {
        console.error("Halting app initialization because components failed to load.");
        return;
      }
      
      // Step 3: Now that components are loaded, get session data.
      const sessionData = await SessionManager.getOrCreateSession();

      // Step 4: Update the top bar with the session data.
      const sessionDisplayElement = document.getElementById("sessionDisplay");
      if (sessionDisplayElement) {
        if (sessionData && sessionData.session_number) {
          sessionDisplayElement.textContent = `Session ID = TSZ ${sessionData.session_number}`;
        } else {
          sessionDisplayElement.textContent = "Error: Could not get session";
        }
      }

      // Step 5: Initialize the tutorial. This is now safe because we know
      // the HTML with '#tutorial-overlay' is on the page.
      initTutorialOverlay();
    }

    // Start the application.
    initializeApp();
  </script>

</body>
</html>
