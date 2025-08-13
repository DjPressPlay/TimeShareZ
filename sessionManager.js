// sessionManager.js
// TimeShareZ Session Manager
// Handles creation, storage, and retrieval of session IDs & session numbers.

const SessionManager = (() => {
  const SESSION_ID_KEY = "session_id";
  const SESSION_NUMBER_KEY = "session_number";
  const RECOVERY_CODE_KEY = "recovery_code_hash";

  function generateUUID() {
    return crypto.randomUUID();
  }

  function generateSessionNumber() {
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    return `TSZ-${String(randomNum).padStart(4, "0")}`;
  }

  function createSession() {
    const sessionId = generateUUID();
    const sessionNumber = generateSessionNumber();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
    localStorage.setItem(SESSION_NUMBER_KEY, sessionNumber);
    return { sessionId, sessionNumber };
  }

  function getSession() {
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    const sessionNumber = localStorage.getItem(SESSION_NUMBER_KEY);
    if (sessionId && sessionNumber) {
      return { sessionId, sessionNumber };
    }
    return null;
  }

  function getOrCreateSession() {
    let session = getSession();
    if (!session) {
      session = createSession();
    }
    return session;
  }

  async function setRecoveryCode(code) {
    const hashHex = await hashString(code);
    localStorage.setItem(RECOVERY_CODE_KEY, hashHex);
    return hashHex;
  }

  async function verifyRecoveryCode(code) {
    const storedHash = localStorage.getItem(RECOVERY_CODE_KEY);
    if (!storedHash) return false;
    const hashHex = await hashString(code);
    return storedHash === hashHex;
  }

  async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function resetSession() {
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_NUMBER_KEY);
    localStorage.removeItem(RECOVERY_CODE_KEY);
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

// Auto-run to ensure session exists & display updates
document.addEventListener("DOMContentLoaded", () => {
  const sessionDisplay = document.getElementById("sessionDisplay");
  if (sessionDisplay) {
    const { sessionNumber } = SessionManager.getOrCreateSession();
    sessionDisplay.textContent = `Session: ${sessionNumber}`;
  }
});

export default SessionManager;
