// /api/getKnowledgeBaseFiles.js

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        // Fetch all chunks for the user, selecting only necessary fields.
        const { data, error } = await supabaseAdmin
            .from('knowledge_base_chunks')
            .select('id, content, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching knowledge base files:', error);
        res.status(500).json({ error: 'Failed to fetch knowledge base files.', details: error.message });
    }
}