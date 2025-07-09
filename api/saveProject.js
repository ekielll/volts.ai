// api/saveProject.js
import { createClient } from '@supabase/supabase-js';

// CORRECTED: Using the correct environment variables for the backend
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const { userId, projectName, htmlCode } = req.body;
    if (!userId || !projectName || !htmlCode) {
      return res.status(400).json({ error: 'Missing required project data.' });
    }
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([{ user_id: userId, name: projectName, html_code: htmlCode }])
      .select();
    if (error) { throw error; }
    res.status(200).json({ success: true, project: data[0] });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project.', details: error.message });
  }
};