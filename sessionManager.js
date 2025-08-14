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
      const res = await fetch("/.netlify/functions/getSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId })
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
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    let sessionNumber = localStorage.getItem(SESSION_NUMBER_KEY);

    if (sessionId && sessionNumber) {
      const existing = await getSession();
      if (existing) return existing;
      console.warn("[TSZ] Stored session invalid, creating a new one");
    }

    return await createSession();
  }

  /**
   * Set a recovery code via Supabase
   */
  async function setRecoveryCode(code) {
    console.log("[TSZ] Calling setRecoveryCode()");
    try {
      const res = await fetch("/.netlify/functions/setRecoveryCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: localStorage.getItem(SESSION_ID_KEY),
          recovery_code: code
        }),
      });

      if (!res.ok) throw new Error(`Failed to set recovery code: ${res.status}`);

      return await res.json();
    } catch (err) {
      console.error("[TSZ] setRecoveryCode error:", err);
      return null;
    }
  }

  /**
   * Verify recovery code and fetch linked session via Supabase
   */
  async function verifyRecoveryCode(code) {
    console.log("[TSZ] Calling verifyRecoveryCode()");
    try {
      const res = await fetch("/.netlify/functions/getSessionByRecoveryCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recovery_code: code }),
      });

      if (!res.ok) return null;

      const { session_id, session_number, all_linked_data } = await res.json();

      if (session_id && session_number) {
        localStorage.setItem(SESSION_ID_KEY, session_id);
        localStorage.setItem(SESSION_NUMBER_KEY, session_number);
      }

      return { session_id, session_number, all_linked_data };
    } catch (err) {
      console.error("[TSZ] verifyRecoveryCode error:", err);
      return null;
    }
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
    setRecoveryCode,
    verifyRecoveryCode,
    resetSession
  };
})();

export default SessionManager;
