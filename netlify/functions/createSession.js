// netlify/functions/createSession.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, context) => {
  try {
    // Generate session values
    const session_number = Math.floor(100000 + Math.random() * 900000);
    const recovery_code = cryptoRandom(8);

    // Insert into Supabase
    const { data, error } = await supabase
      .from("sessions")
      .insert([{ session_number, recovery_code }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return new Response(JSON.stringify({ error: "db_insert_failed" }), { status: 500 });
    }

    return new Response(
      JSON.stringify({
        session_id: data.id,
        session_number: data.session_number,
        recovery_code: data.recovery_code,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: "server_error" }), { status: 500 });
  }
};

function cryptoRandom(len) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return [...bytes].map(b => alphabet[b % alphabet.length]).join("");
}
