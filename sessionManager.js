// sessionManager.js
// TimeShareZ Session Manager
// Handles creation, storage, and retrieval of session IDs & session numbers from Supabase via Netlify Functions

const SessionManager = (() => {
  const SESSION_ID_KEY = "session_id";
  const SESSION_NUMBER_KEY = "session_number";

  /**
   * Create a new session via Netlify -> Supabase
   */
  async function createSession() {
    const res = await fetch("/.netlify/functions/createSession", { method: "POST" });
    if (!res.ok) throw new Error("Failed to create session");

    const { session_id, session_number, all_linked_data } = await res.json();

    localStorage.setItem(SESSION_ID_KEY, session_id);
    localStorage.setItem(SESSION_NUMBER_KEY, session_number);

    return { session_id, session_number, all_linked_data };
  }

  /**
   * Retrieve existing session via Netlify -> Supabase
   */
  async function getSession() {
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) return null;

    const res = await fetch("/.netlify/functions/getSession", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!res.ok) throw new Error("Failed to get session");

    const { session_id, session_number, all_linked_data } = await res.json();

    // Update local storage in case server has corrections
    localStorage.setItem(SESSION_ID_KEY, session_id);
    localStorage.setItem(SESSION_NUMBER_KEY, session_number);

    return { session_id, session_number, all_linked_data };
  }

  /**
   * Get or create session on demand
   */
  async function getOrCreateSession() {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    let sessionNumber = localStorage.getItem(SESSION_NUMBER_KEY);

    if (sessionId && sessionNumber) {
      return await getSession();
    }

    return await createSession();
  }

  /**
   * Set a recovery code via Supabase
   */
  async function setRecoveryCode(code) {
    const res = await fetch("/.netlify/functions/setRecoveryCode", {
      method: "POST",
      body: JSON.stringify({ session_id: localStorage.getItem(SESSION_ID_KEY), recovery_code: code }),
    });

    if (!res.ok) throw new Error("Failed to set recovery code");

    return await res.json();
  }

  /**
   * Verify recovery code via Supabase
   */
  async function verifyRecoveryCode(code) {
    const res = await fetch("/.netlify/functions/getSessionByRecoveryCode", {
      method: "POST",
      body: JSON.stringify({ recovery_code: code }),
    });

    if (!res.ok) return null;

    const { session_id, session_number, all_linked_data } = await res.json();

    localStorage.setItem(SESSION_ID_KEY, session_id);
    localStorage.setItem(SESSION_NUMBER_KEY, session_number);

    return { session_id, session_number, all_linked_data };
  }

  /**
   * Reset local session storage
   */
  function resetSession() {
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_NUMBER_KEY);
  }

  return {
    createSession,
    getSession,
    getOrCreateSession,
    setRecoveryCode,
    verifyRecoveryCode,
    resetSession
  };
})();

// Auto-run to ensure session exists & update top bar display
document.addEventListener("DOMContentLoaded", async () => {
  const sessionDisplay = document.getElementById("sessionDisplay");
  if (sessionDisplay) {
    try {
      const { session_number } = await SessionManager.getOrCreateSession();
      sessionDisplay.textContent = `Session: ${session_number}`;
    } catch (err) {
      console.error("Session error:", err);
      sessionDisplay.textContent = "Session: ERROR";
    }
  }
});

export default SessionManager;
