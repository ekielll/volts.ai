// /api/uploadLogo.js

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

        const logoFile = files.file[0];
        const userId = fields.userId[0];
        const logoType = fields.logoType[0];

        if (!logoFile || !userId || !logoType) {
            return res.status(400).json({ error: 'File, user ID, and logo type are required.' });
        }

        const fileBuffer = fs.readFileSync(logoFile.filepath);
        const filePath = `${userId}/${logoType}_${Date.now()}_${logoFile.originalFilename}`;
        
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('brand-assets')
            .upload(filePath, fileBuffer, {
                contentType: logoFile.mimetype,
                upsert: true,
            });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabaseAdmin.storage
            .from('brand-assets')
            .getPublicUrl(uploadData.path);

        const columnToUpdate = logoType === 'light' ? 'logo_url_light' : 'logo_url_dark';
        
        const { error: dbError } = await supabaseAdmin
            .from('brand_assets')
            .upsert({ user_id: userId, [columnToUpdate]: urlData.publicUrl }, { onConflict: 'user_id' });

        if (dbError) throw dbError;

        fs.unlinkSync(logoFile.filepath);
        
        res.status(200).json({ message: 'Logo uploaded successfully.', url: urlData.publicUrl });

    } catch (error) {
        console.error('Error uploading logo:', error);
        res.status(500).json({ error: 'Failed to upload logo.', details: error.message });
    }
}