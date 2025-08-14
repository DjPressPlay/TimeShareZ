// netlify/functions/createSession.js
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role needed for inserts
);

function json(body, statusCode = 200) {
  return { statusCode, body: JSON.stringify(body) };
}

// simple 6-digit human number; if you have a DB default/sequence, remove this
function generateSessionNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return n;
}

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const { recovery_code } = body || {};

    const insertPayload = {
      session_number: generateSessionNumber(),
    };

    if (recovery_code && typeof recovery_code === 'string' && recovery_code.trim()) {
      const hash = crypto.createHash('sha256').update(recovery_code).digest('hex');
      insertPayload.recovery_code_hash = hash;
    }

    // 1) create session row
    const { data: sessionInsert, error: sessionErr } = await supabase
      .from('sessions')
      .insert([insertPayload])
      .select()
      .single();

    if (sessionErr) throw sessionErr;

    const session = sessionInsert;

    // 2) fetch linked data (empty on day one, but we return consistent shape)
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
