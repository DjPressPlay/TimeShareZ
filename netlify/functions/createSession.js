// netlify/functions/createSession.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async () => {
  // insert a blank row, let Supabase/table defaults handle session_number
  const { data } = await supabase
    .from("sessions")
    .insert([{}])
    .select()
    .single();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
