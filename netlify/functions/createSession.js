import { createClient } from "@supabase/supabase-js";

// Pull values from environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

// Create the client
const supabase = createClient(supabaseUrl, supabaseKey);

// Example: send one row to the "messages" table
export async function sendToSupabase() {
  const { data, error } = await supabase
    .from("messages")
    .insert([
      { text: "Hello from TimeShareZ!", created_at: new Date().toISOString() }
    ]);

  if (error) {
    console.error("❌ Supabase insert failed:", error);
    return null;
  }

  console.log("✅ Row inserted:", data);
  return data;
}
