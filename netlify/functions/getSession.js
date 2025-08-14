// netlify/functions/getSession.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
  try {
    const { session_id } = JSON.parse(event.body || '{}');

    if (!session_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing session_id' })
      };
    }

    // Fetch session row
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', session_id)
      .single();

    if (sessionError) throw sessionError;
    if (!session) throw new Error('Session not found');

    // Fetch linked projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('session_id', session_id);

    if (projectsError) throw projectsError;

    // Fetch linked spots
    const { data: spots, error: spotsError } = await supabase
      .from('spots')
      .select('*')
      .eq('session_id', session_id);

    if (spotsError) throw spotsError;

    // Return unified payload
    return {
      statusCode: 200,
      body: JSON.stringify({
        session_id: session.id,
        session_number: session.session_number,
        all_linked_data: {
          projects: projects || [],
          spots: spots || [],
          recovery_code_set: !!session.recovery_code_hash
        }
      })
    };
  } catch (err) {
    console.error('Get Session Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
