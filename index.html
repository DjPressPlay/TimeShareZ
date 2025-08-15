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
    // Import only the SessionManager as the tutorial is no longer needed.
    import SessionManager from './sessionManager.js';

    // The array of components to load, with "tutorial-overlay" removed.
    const components = [
      "top-bar",
      "funded-feed",
      "hot-feed",
      "main-rotator",
      "footer"
    ];

    /**
     * Loads all component HTML files and injects them into the page.
     * Returns true on success, false if any file fails to load.
     */
    async function loadComponents() {
      const root = document.getElementById("app-root");
      try {
        const responses = await Promise.all(
          components.map(name => fetch(`components/${name}.html`))
        );

        for (const res of responses) {
          if (!res.ok) {
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
      // Step 1: Load all the visual components.
      const loadedSuccessfully = await loadComponents();

      // Step 2: If loading failed, halt initialization.
      if (!loadedSuccessfully) {
        console.error("Halting app initialization because components failed to load.");
        return;
      }
      
      // Step 3: Get session data.
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

      // Tutorial initialization has been removed.
    }

    // Start the application.
    initializeApp();
  </script>

</body>
</html>
