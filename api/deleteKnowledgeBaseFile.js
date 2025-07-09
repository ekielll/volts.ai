// /api/deleteKnowledgeBaseFile.js

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { userId, chunkId } = req.body;

        if (!userId || !chunkId) {
            return res.status(400).json({ error: 'User ID and Chunk ID are required.' });
        }

        // Deletes the specified chunk, but only if it belongs to the user.
        // The RLS policy we created earlier enforces this security.
        const { error } = await supabaseAdmin
            .from('knowledge_base_chunks')
            .delete()
            .eq('id', chunkId)
            .eq('user_id', userId);

        if (error) { throw error; }

        res.status(200).json({ message: 'File chunk deleted successfully.' });
    } catch (error) {
        console.error('Error deleting knowledge base file:', error);
        res.status(500).json({ error: 'Failed to delete file chunk.', details: error.message });
    }
}