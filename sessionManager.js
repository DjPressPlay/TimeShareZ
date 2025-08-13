// sessionManager.js
// TimeShareZ Session Manager
// Handles creation, storage, and retrieval of session IDs & session numbers.

const SessionManager = (() => {
  const SESSION_ID_KEY = "session_id";
  const SESSION_NUMBER_KEY = "session_number";
  const RECOVERY_CODE_KEY = "recovery_code_hash";

  /**
   * Generate a UUID v4 for session_id
   */
  function generateUUID() {
    return crypto.randomUUID();
  }

  /**
   * Generate a display session number in TSZ-0001 format
   * (TEMP: local generator — replace with backend call for sequential IDs)
   */
  function generateSessionNumber() {
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    return `TSZ-${String(randomNum).padStart(4, "0")}`;
  }

  /**
   * Get current session or create a new one
   */
  function getOrCreateSession() {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    let sessionNumber = localStorage.getItem(SESSION_NUMBER_KEY);

    if (!sessionId || !sessionNumber) {
      sessionId = generateUUID();
      sessionNumber = generateSessionNumber();

      localStorage.setItem(SESSION_ID_KEY, sessionId);
      localStorage.setItem(SESSION_NUMBER_KEY, sessionNumber);
    }

    return { sessionId, sessionNumber };
  }

  /**
   * Set a recovery code (stores hashed)
   */
  async function setRecoveryCode(code) {
    const hashHex = await hashString(code);
    localStorage.setItem(RECOVERY_CODE_KEY, hashHex);
    return hashHex;
  }

  /**
   * Verify a recovery code
   */
  async function verifyRecoveryCode(code) {
    const storedHash = localStorage.getItem(RECOVERY_CODE_KEY);
    if (!storedHash) return false;
    const hashHex = await hashString(code);
    return storedHash === hashHex;
  }

  /**
   * Utility: Hash a string with SHA-256
   */
  async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Reset the session (for testing or manual logout)
   */
  function resetSession() {
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_NUMBER_KEY);
    localStorage.removeItem(RECOVERY_CODE_KEY);
  }

  return {
    getOrCreateSession,
    setRecoveryCode,
    verifyRecoveryCode,
    resetSession
  };
})();

// Auto-run on page load if #sessionDisplay exists
document.addEventListener("DOMContentLoaded", () => {
  const sessionDisplay = document.getElementById("sessionDisplay");
  if (sessionDisplay) {
    const { sessionNumber } = SessionManager.getOrCreateSession();
    sessionDisplay.textContent = `Session: ${sessionNumber}`;
  }
});

export default SessionManager;
