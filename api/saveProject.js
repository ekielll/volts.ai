// /api/saveProject.js
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
    // 1. UPDATED: Destructure chatHistory from the request body
    const { userId, projectName, htmlCode, chatHistory } = req.body;

    if (!userId || !projectName || !htmlCode) {
      return res.status(400).json({ error: 'Missing required project data.' });
    }
    
    // 2. UPDATED: Include chat_history in the object to be inserted
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([{ 
          user_id: userId, 
          name: projectName, 
          html_code: htmlCode, 
          chat_history: chatHistory // Add this field
      }])
      .select();

    if (error) { throw error; }
    
    res.status(200).json({ success: true, project: data[0] });
    
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project.', details: error.message });
  }
};