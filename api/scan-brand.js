// /api/scan-brand.js

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// FIXED: The prompt now asks for a simple array of colors to match the UI.
const BRAND_ANALYSIS_PROMPT = `
You are an expert brand and design analyst. Your task is to analyze the raw HTML of a website to identify its core brand assets.

Analyze the provided website code and return ONLY a single, valid JSON object with the following structure:
{
  "color_palette": ["#...", "#...", "#...", "#...", "#..."],
  "font_pair": {
    "headline": "Font Name",
    "body": "Font Name"
  }
}

- For "color_palette", provide an array of the 5 most prominent hex color codes.
- For "font_pair", identify the primary font for headings and body text.
- Do not include any conversational text, explanations, or markdown. Your response must be the raw JSON object only.
`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userId, url } = req.body;

    if (!userId || !url) {
        return res.status(400).json({ error: 'User ID and URL are required.' });
    }

    try {
        const pageResponse = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!pageResponse.ok) {
            throw new Error(`Failed to fetch the website. Status: ${pageResponse.status}`);
        }
        const html = await pageResponse.text();
        const $ = cheerio.load(html);
        const textContent = $('body').text().replace(/\s\s+/g, ' ').trim().substring(0, 4000);

        const aiResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: BRAND_ANALYSIS_PROMPT },
                { role: 'user', content: `Analyze the following website content:\n\nHTML Body Text:\n${textContent}` }
            ],
            response_format: { type: "json_object" }
        });

        const brandData = JSON.parse(aiResponse.choices[0].message.content);

        // Check that the returned data is an array
        if (!brandData.color_palette || !Array.isArray(brandData.color_palette) || !brandData.font_pair) {
            throw new Error("AI analysis did not return the expected data format.");
        }

        const { error: dbError } = await supabaseAdmin
            .from('brand_assets')
            .upsert({ 
                user_id: userId, 
                color_palette: brandData.color_palette, // Save the array
                font_pair: brandData.font_pair,
            }, { onConflict: 'user_id' });

        if (dbError) {
            throw dbError;
        }

        return res.status(200).json({ message: 'Brand assets identified and saved successfully.', brandData });

    } catch (error) {
        console.error('Error in /api/scan-brand:', error);
        return res.status(500).json({ error: 'Failed to scan brand.', details: error.message });
    }
}