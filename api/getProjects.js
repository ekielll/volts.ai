// api/getProjects.js
import { createClient } from '@supabase/supabase-js';

// CORRECTED: Using the correct environment variables for the backend
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('id, name, created_at, html_code')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) { throw error; }
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects.', details: error.message });
  }
};