// /api/updateFontPair.js

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { userId, fontPair } = req.body;

        if (!userId || !fontPair || !fontPair.heading || !fontPair.body) {
            return res.status(400).json({ error: 'User ID and a complete font pair are required.' });
        }

        const { error } = await supabaseAdmin
            .from('brand_assets')
            .upsert({ user_id: userId, font_pair: fontPair }, { onConflict: 'user_id' });
        
        if (error) throw error;

        res.status(200).json({ message: 'Font pair saved successfully.' });

    } catch (error) {
        console.error('Error updating font pair:', error);
        res.status(500).json({ error: 'Failed to save font pair.', details: error.message });
    }
}