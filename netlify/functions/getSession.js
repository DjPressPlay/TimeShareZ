// netlify/functions/getSession.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const id = event.queryStringParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "missing_id" }),
      };
    }

    // Query by the correct PK
    const { data, error } = await supabase
      .from("sessions")
      .select("session_id, session_number, created_at, last_active")
      .eq("session_id", id)
      .single();

    if (error || !data) {
      console.error("Supabase getSession error:", error);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "not_found" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (e) {
    console.error("Server error:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "server_error", detail: e.message }),
    };
  }
};
