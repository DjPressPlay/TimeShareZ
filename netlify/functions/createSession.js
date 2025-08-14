
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Netlify Functions v2 handler
export default async (req, context) => {
  try {
    // simple short number; replace with your generator if needed
    const session_number = Math.floor(100000 + Math.random() * 900000);
    const recovery_code = cryptoRandom(8);

    const { data, error } = await supabase
      .from("sessions")
      .insert([{ session_number, recovery_code }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return new Response(JSON.stringify({ error: "db_insert_failed" }), { status: 500 });
    }

    // Return the data you expect in sessionManager.js
    return new Response(JSON.stringify({
      session_id: data.id,
      session_number: data.session_number,
      recovery_code: data.recovery_code
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "server_error" }), { status: 500 });
  }
};

function cryptoRandom(len) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return [...bytes].map(b => alphabet[b % alphabet.length]).join("");
}
