// netlify/functions/createSession.js
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role for inserts
);

function json(body, statusCode = 200) {
  return { statusCode, body: JSON.stringify(body) };
}

// simple 6-digit session number; delete if DB auto-generates
function generateSessionNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') return json({ error: 'Method not allowed' }, 405);

    const body = event.body ? JSON.parse(event.body) : {};
    const { recovery_code } = body || {};

    const insert = { session_number: generateSessionNumber() };
    if (recovery_code && typeof recovery_code === 'string' && recovery_code.trim()) {
      insert.recovery_code_hash = crypto.createHash('sha256').update(recovery_code).digest('hex');
    }

    // 1) create session row
    const { data: session, error: sesErr } = await supabase
      .from('sessions')
      .insert([insert])
      .select()
      .single();
    if (sesErr) throw sesErr;

    // 2) fetch linked data (will be empty on day one)
    const [{ data: projects, error: projErr }, { data: spots, error: spotsErr }] =
      await Promise.all([
        supabase.from('projects').select('*').eq('session_id', session.id),
        supabase.from('spots').select('*').eq('session_id', session.id),
      ]);
    if (projErr) throw projErr;
    if (spotsErr) throw spotsErr;

    return json({
      session_id: session.id,
      session_number: session.session_number,
      all_linked_data: {
        projects: projects || [],
        spots: spots || [],
        recovery_code_set: !!session.recovery_code_hash,
      },
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
