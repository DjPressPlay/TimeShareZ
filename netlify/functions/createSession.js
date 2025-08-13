
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Needs service key for insert
);

export async function handler(event) {
  try {
    // Insert a new session row using sequence for session_number
    const { data, error } = await supabase.rpc('create_new_session'); 
    // ^ create_new_session() is a Postgres function that uses nextval('session_number_seq') to generate TSZ-####

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        session_id: data.id,
        session_number: data.session_number,
        all_linked_data: {
          projects: [],
          spots: [],
          recovery_code_set: !!data.recovery_code_hash
        }
      })
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
