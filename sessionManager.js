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
    try {
      const res = await fetch("/.netlify/functions/createSession", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create session");

      const { session_id, session_number, all_linked_data } = await res.json();

      localStorage.setItem(SESSION_ID_KEY, session_id);
      localStorage.setItem(SESSION_NUMBER_KEY, session_number);

      return { session_id, session_number, all_linked_data };
    } catch (err) {
      console.error("createSession error:", err);
      return null;
    }
  }

  /**
   * Retrieve existing session via Netlify -> Supabase
   */
  async function getSession() {
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) return null;

    try {
      const res = await fetch("/.netlify/functions/getSession", {
        method: "POST",
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!res.ok) throw new Error("Failed to get session");

      const { session_id, session_number, all_linked_data } = await res.json();

      // Update local storage in case server returns updated info
      localStorage.setItem(SESSION_ID_KEY, session_id);
      localStorage.setItem(SESSION_NUMBER_KEY, session_number);

      return { session_id, session_number, all_linked_data };
    } catch (err) {
      console.error("getSession error:", err);
      return null;
    }
  }

  /**
   * Get existing session from backend, or create a new one if missing
   */
  async function getOrCreateSession() {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    let sessionNumber = localStorage.getItem(SESSION_NUMBER_KEY);

    if (sessionId && sessionNumber) {
      const existing = await getSession();
      if (existing) return existing;
    }

    return await createSession();
  }

  /**
   * Set a recovery code via Supabase
   */
  async function setRecoveryCode(code) {
    try {
      const res = await fetch("/.netlify/functions/setRecoveryCode", {
        method: "POST",
        body: JSON.stringify({
          session_id: localStorage.getItem(SESSION_ID_KEY),
          recovery_code: code,
        }),
      });

      if (!res.ok) throw new Error("Failed to set recovery code");

      return await res.json();
    } catch (err) {
      console.error("setRecoveryCode error:", err);
      return null;
    }
  }

  /**
   * Verify recovery code and fetch linked session via Supabase
   */
  async function verifyRecoveryCode(code) {
    try {
      const res = await fetch("/.netlify/functions/getSessionByRecoveryCode", {
        method: "POST",
        body: JSON.stringify({ recovery_code: code }),
      });

      if (!res.ok) return null;

      const { session_id, session_number, all_linked_data } = await res.json();

      localStorage.setItem(SESSION_ID_KEY, session_id);
      localStorage.setItem(SESSION_NUMBER_KEY, session_number);

      return { session_id, session_number, all_linked_data };
    } catch (err) {
      console.error("verifyRecoveryCode error:", err);
      return null;
    }
  }

  /**
   * Reset local session storage only
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

export default SessionManager;
