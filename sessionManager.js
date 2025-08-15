// ==========================
// TimeShareZ – sessionManager.js (pure)
// ==========================

const SessionManager = (() => {
  const SESSION_ID_KEY = "session_id";
  const SESSION_NUMBER_KEY = "session_number";

  async function createSession() {
    try {
      const res = await fetch("/.netlify/functions/createSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error();

      const { session_id, session_number, all_linked_data } = await res.json();
      if (!session_id || !session_number) throw new Error();

      localStorage.setItem(SESSION_ID_KEY, session_id);
      localStorage.setItem(SESSION_NUMBER_KEY, session_number);

      return { session_id, session_number, all_linked_data };
    } catch {
      return null;
    }
  }

  async function getSession() {
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) return null;

    try {
      const res = await fetch(
        `/.netlify/functions/getSession?id=${encodeURIComponent(sessionId)}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) throw new Error();

      const { session_id, session_number, all_linked_data } = await res.json();
      if (!session_id || !session_number) throw new Error();

      localStorage.setItem(SESSION_ID_KEY, session_id);
      localStorage.setItem(SESSION_NUMBER_KEY, session_number);

      return { session_id, session_number, all_linked_data };
    } catch {
      return null;
    }
  }

  async function getOrCreateSession() {
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    const sessionNumber = localStorage.getItem(SESSION_NUMBER_KEY);

    if (sessionId && sessionNumber) {
      const existing = await getSession();
      if (existing) return existing;
    }
    return await createSession();
  }

  function resetSession() {
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
