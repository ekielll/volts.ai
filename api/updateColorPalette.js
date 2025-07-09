// /api/updateColorPalette.js

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { userId, palette } = req.body;

        if (!userId || !Array.isArray(palette)) {
            return res.status(400).json({ error: 'User ID and a palette array are required.' });
        }

        // Use upsert to create or update the brand_assets row for the user.
        // onConflict: 'user_id' tells Supabase to find the row with this user_id and update it,
        // or create a new one if it doesn't exist.
        const { error } = await supabaseAdmin
            .from('brand_assets')
            .upsert({ user_id: userId, color_palette: palette }, { onConflict: 'user_id' });
        
        if (error) throw error;

        res.status(200).json({ message: 'Palette saved successfully.' });

    } catch (error) {
        console.error('Error updating color palette:', error);
        res.status(500).json({ error: 'Failed to save palette.', details: error.message });
    }
}