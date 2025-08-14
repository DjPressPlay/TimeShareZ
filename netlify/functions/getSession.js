
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, context) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); // uuid
    if (!id) return new Response(JSON.stringify({ error: "missing_id" }), { status: 400 });

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return new Response(JSON.stringify({ error: "not_found" }), { status: 404 });

    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "server_error" }), { status: 500 });
  }
};
