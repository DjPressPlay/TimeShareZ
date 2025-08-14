// netlify/functions/getSession.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

exports.handler = async (event) => {
  try {
    // Accept GET or POST
    if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { Allow: "GET, POST" },
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    let id;

    if (event.httpMethod === "GET") {
      id = event.queryStringParameters?.id;
    } else if (event.httpMethod === "POST") {
      try {
        const body = JSON.parse(event.body || "{}");
        id = body.session_id;
      } catch (parseErr) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "invalid_json" }),
        };
      }
    }

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "missing_id" }),
      };
    }

    // Query by correct PK
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
