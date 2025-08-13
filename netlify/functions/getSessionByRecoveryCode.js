
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
  try {
    const { recovery_code } = JSON.parse(event.body || '{}');
    if (!recovery_code) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing recovery_code' }) };
    }

    // Hash the recovery code
    const hashHex = crypto.createHash('sha256').update(recovery_code).digest('hex');

    // Look up session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('recovery_code_hash', hashHex)
      .single();

    if (sessionError || !session) throw sessionError || new Error('Session not found');

    // Get linked projects
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('session_id', session.id);

    // Get linked spots
    const { data: spots } = await supabase
      .from('spots')
      .select('*')
      .eq('session_id', session.id);

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
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
