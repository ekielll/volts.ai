// /api/deleteLogo.js

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { userId, logoType } = req.body;

        if (!userId || !logoType) {
            return res.status(400).json({ error: 'User ID and logo type are required.' });
        }
        
        const columnToUpdate = logoType === 'light' ? 'logo_url_light' : 'logo_url_dark';

        // 1. Get the current logo URL from the database to find the file path
        const { data: assetData, error: fetchError } = await supabaseAdmin
            .from('brand_assets')
            .select(columnToUpdate)
            .eq('user_id', userId)
            .single();

        if (fetchError || !assetData || !assetData[columnToUpdate]) {
            // If there's no logo to delete, just return success.
            return res.status(200).json({ message: 'No logo to delete.' });
        }

        // 2. Extract the file path from the URL
        const url = assetData[columnToUpdate];
        const filePath = url.substring(url.lastIndexOf('/') + 1);
        
        // 3. Delete the file from Supabase Storage
        const { error: storageError } = await supabaseAdmin.storage
            .from('brand_assets')
            .remove([`${userId}/${filePath}`]);

        if (storageError && storageError.statusCode !== '404') {
            // We can ignore 404 errors, as the file might already be deleted.
            console.error('Storage deletion error:', storageError);
        }

        // 4. Set the logo URL in the database table to NULL
        const { error: dbError } = await supabaseAdmin
            .from('brand_assets')
            .update({ [columnToUpdate]: null })
            .eq('user_id', userId);

        if (dbError) throw dbError;

        res.status(200).json({ message: 'Logo removed successfully.' });

    } catch (error) {
        console.error('Error removing logo:', error);
        res.status(500).json({ error: 'Failed to remove logo.', details: error.message });
    }
}