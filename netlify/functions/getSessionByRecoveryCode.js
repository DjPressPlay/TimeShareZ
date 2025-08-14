
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, context) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) return new Response(JSON.stringify({ error: "missing_code" }), { status: 400 });

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("recovery_code", code)
      .single();

    if (error || !data) return new Response(JSON.stringify({ error: "not_found" }), { status: 404 });

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
