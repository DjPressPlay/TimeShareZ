// netlify/functions/createSession.js
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function handler(event, context) {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error("Missing Supabase env vars");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "missing_env" })
      };
    }

    const session_number = String(Math.floor(100000 + Math.random() * 900000));

    const { data, error } = await supabase
      .from("sessions")
      .insert([{ session_number }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "db_insert_failed", details: error.message })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: data.session_id,      // assumes your PK column is session_id (uuid)
        session_number: data.session_number
      })
    };
  } catch (err) {
    console.error("Server error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "server_error" }) };
  }
}
