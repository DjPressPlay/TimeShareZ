// netlify/functions/createSession.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, context) => {
  try {
    // Make a random 6-digit session number as string
    const session_number = String(Math.floor(100000 + Math.random() * 900000));

    // Insert into Supabase — only the columns we need
    const { data, error } = await supabase
      .from("sessions")
      .insert([{ session_number }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return new Response(JSON.stringify({ error: "db_insert_failed" }), { status: 500 });
    }

    // Return the new session info
    return new Response(
      JSON.stringify({
        session_id: data.session_id,      // comes from Supabase
        session_number: data.session_number
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: "server_error" }), { status: 500 });
  }
};
