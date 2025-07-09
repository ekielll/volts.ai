// /api/uploadImage.js

import { createClient } from '@supabase/supabase-js';
import { IncomingForm } from 'formidable';
import fs from 'fs';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const form = new IncomingForm();
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve([fields, files]);
            });
        });

        const imageFile = files.file[0];
        const userId = fields.userId[0];

        if (!imageFile || !userId) {
            return res.status(400).json({ error: 'File and user ID are required.' });
        }

        const fileBuffer = fs.readFileSync(imageFile.filepath);
        // Create a more generic file path for general images
        const filePath = `${userId}/images/${Date.now()}_${imageFile.originalFilename}`;
        
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('project_assets') // Using a new or different bucket for general assets
            .upload(filePath, fileBuffer, {
                contentType: imageFile.mimetype,
                upsert: false, // Don't upsert to avoid overwriting files with the same name
            });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabaseAdmin.storage
            .from('project_assets')
            .getPublicUrl(uploadData.path);

        fs.unlinkSync(imageFile.filepath);
        
        res.status(200).json({ message: 'Image uploaded successfully.', url: urlData.publicUrl });

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image.', details: error.message });
    }
}