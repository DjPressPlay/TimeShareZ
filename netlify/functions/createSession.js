// netlify/functions/createSession.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service key for inserts
);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { data, error } = await supabase.rpc("create_new_session");

    console.log("Supabase RPC response:", data);

    if (error) throw error;
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error("No session data returned");
    }

    const session = Array.isArray(data) ? data[0] : data;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: session.id,
        session_number: session.session_number,
        all_linked_data: {
          projects: [],
          spots: [],
          recovery_code_set: !!session.recovery_code_hash
        }
      })
    };
  } catch (err) {
    console.error("Create Session Error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message })
    };
  }
}
