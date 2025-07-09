// /api/get-inspiration.js

import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase admin client, just like in your generate.js file
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 1. Fetch all available items from our inspiration library
        const { data: items, error } = await supabaseAdmin
            .from('inspiration_items')
            .select('*');

        if (error) {
            throw error;
        }

        if (!items || items.length === 0) {
            return res.status(200).json([]);
        }

        // 2. Shuffle the array to ensure randomness (Fisher-Yates shuffle algorithm)
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        // 3. Return the first 3 items from the shuffled array
        const randomItems = items.slice(0, 3);

        return res.status(200).json(randomItems);

    } catch (error) {
        console.error('Error fetching inspiration items:', error);
        return res.status(500).json({ error: 'Failed to fetch inspiration items.', details: error.message });
    }
}