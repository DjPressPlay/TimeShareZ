// ==========================
// TimeShareZ – sessionManager.js
// ==========================
// Handles creation, storage, and retrieval of session IDs & session numbers from Supabase via Netlify Functions

const SessionManager = (() => {
  const SESSION_ID_KEY = "session_id";
  const SESSION_NUMBER_KEY = "session_number";

  /**
   * Create a new session via Netlify -> Supabase
   */
  async function createSession() {
    console.log("[TSZ] Calling createSession()");
    try {
      const res = await fetch("/.netlify/functions/createSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error(`Failed to create session: ${res.status}`);

      const { session_id, session_number, all_linked_data } = await res.json();
      if (!session_id || !session_number) {
        throw new Error("Invalid session payload from createSession");
      }

      localStorage.setItem(SESSION_ID_KEY, session_id);
      localStorage.setItem(SESSION_NUMBER_KEY, session_number);

      return { session_id, session_number, all_linked_data };
    } catch (err) {
      console.error("[TSZ] createSession error:", err);
      return null;
    }
  }

  /**
   * Retrieve existing session via Netlify -> Supabase
   */
  async function getSession() {
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      console.warn("[TSZ] getSession() called without a session_id in storage");
      return null;
    }

    console.log("[TSZ] Calling getSession() for", sessionId);
    try {
      const res = await fetch(`/.netlify/functions/getSession?id=${encodeURIComponent(sessionId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error(`Failed to get session: ${res.status}`);

      const { session_id, session_number, all_linked_data } = await res.json();
      if (!session_id || !session_number) {
        throw new Error("Invalid session payload from getSession");
      }

      localStorage.setItem(SESSION_ID_KEY, session_id);
      localStorage.setItem(SESSION_NUMBER_KEY, session_number);

      return { session_id, session_number, all_linked_data };
    } catch (err) {
      console.error("[TSZ] getSession error:", err);
      return null;
    }
  }

  /**
   * Get existing session from backend, or create a new one if missing
   */
  async function getOrCreateSession() {
    console.log("[TSZ] getOrCreateSession() called");
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    const sessionNumber = localStorage.getItem(SESSION_NUMBER_KEY);

    if (sessionId && sessionNumber) {
      const existing = await getSession();
      if (existing) return existing;
      console.warn("[TSZ] Stored session invalid, creating a new one");
    }

    return await createSession();
  }

  /**
   * Reset local session storage only
   */
  function resetSession() {
    console.log("[TSZ] Resetting local session");
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_NUMBER_KEY);
  }

  return {
    createSession,
    getSession,
    getOrCreateSession,
    resetSession
  };
})();

export default SessionManager;
