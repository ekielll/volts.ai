// api/startTrial.js

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // This query calculates the trial end date as 7 days from the current moment
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
      .eq('id', userId)
      .select();

    if (error) { throw error; }

    res.status(200).json({ success: true, profile: data[0] });
  } catch (error) {
    console.error('Error starting trial:', error);
    res.status(500).json({ error: 'Failed to start trial.', details: error.message });
  }
};