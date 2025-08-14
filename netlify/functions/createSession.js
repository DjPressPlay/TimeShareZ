// netlify/functions/createSession.js
import { createClient } from '@supabase/supabase-js';

// These must be set in Netlify's environment variables UI or a local .env file
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service key for inserts
);

export async function handler(event) {
  try {
    // Call your Postgres function
    const { data, error } = await supabase.rpc('create_new_session');

    if (error) throw error;
    if (!data) throw new Error('No session data returned');

    // If create_new_session returns a single row, make sure to grab it correctly
    const session = Array.isArray(data) ? data[0] : data;

    return {
      statusCode: 200,
      body: JSON.stringify({
        session_id: session.id,
        session_number: session.session_number,
        all_linked_data: {
          projects: [],
          spots: [],
          recovery_code_set: !!session.recovery_code_hash
        }
      })
    };
  } catch (err) {
    console.error('Create Session Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
