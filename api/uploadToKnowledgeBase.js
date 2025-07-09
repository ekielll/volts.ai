// /api/uploadToKnowledgeBase.js

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

// Initialize Supabase and OpenAI clients using environment variables
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Vercel's serverless functions have a default body size limit.
// We need to disable it to allow for file uploads.
export const config = {
    api: {
        bodyParser: false,
    },
};

// Main handler for the API route
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const form = new IncomingForm();
        
        // This formidable function parses the incoming file upload
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve([fields, files]);
            });
        });

        const uploadedFile = files.file[0];
        const userId = fields.userId[0];

        if (!uploadedFile || !userId) {
            return res.status(400).json({ error: 'File and user ID are required.' });
        }

        // 1. Read the content of the uploaded file
        let textContent = '';
        const fileBuffer = fs.readFileSync(uploadedFile.filepath);

        if (uploadedFile.mimetype === 'application/pdf') {
            const data = await pdf(fileBuffer);
            textContent = data.text;
        } else if (uploadedFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
            textContent = value;
        } else { // Default to plain text
            textContent = fileBuffer.toString('utf-8');
        }

        // Clean up the temporary file
        fs.unlinkSync(uploadedFile.filepath);

        // 2. Split the text into smaller, manageable chunks
        // This is a simple chunking strategy. More advanced methods can be used.
        const textChunks = textContent.match(/[\s\S]{1,1000}/g) || [];

        if (textChunks.length === 0) {
            return res.status(400).json({ error: 'Could not extract text from the file.' });
        }

        // 3. Generate an embedding for each chunk using OpenAI
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small', // A cost-effective and powerful model
            input: textChunks,
        });

        // 4. Prepare the data to be saved to Supabase
        const chunksToInsert = embeddingResponse.data.map((embeddingObj, i) => ({
            user_id: userId,
            content: textChunks[i],
            embedding: embeddingObj.embedding,
        }));

        // 5. Save the chunks and their embeddings to the database
        const { error } = await supabaseAdmin
            .from('knowledge_base_chunks')
            .insert(chunksToInsert);

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }

        res.status(200).json({ message: 'File processed and stored successfully.', chunkCount: chunksToInsert.length });

    } catch (error) {
        console.error('Error processing file upload:', error);
        res.status(500).json({ error: 'Failed to process file.', details: error.message });
    }
}