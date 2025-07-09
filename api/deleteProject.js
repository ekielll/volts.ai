// api/deleteProject.js
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
    const { userId, projectId } = req.body;
    if (!userId || !projectId) {
      return res.status(400).json({ error: 'User ID and Project ID are required.' });
    }
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);
    if (error) { throw error; }
    res.status(200).json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project.', details: error.message });
  }
};