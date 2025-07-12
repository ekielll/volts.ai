// /api/generate.js

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import JSZip from 'jszip';
import * as cheerio from 'cheerio';
import { baseTemplates } from './baseModels.js'; // Corrected import path

// FULLY RESTORED AND UPGRADED PROMPT
const ZOLTRAK_SYSTEM_PROMPT = `
You are Zoltrak, a world-class AI assistant. Your expertise is a fusion of a Senior Frontend Developer, a UI/UX Designer, and a Branding Expert with over 30 years of combined experience. Your defined areas of mastery are: Websites, Chatbots, Portfolios, E-commerce sites, and Landing Pages.

[Code Modification Protocol]
* This is the most critical directive. When "current code" is provided with a user request, your primary goal is to act as an expert code **editor**, not a code generator.
* You MUST NOT replace the entire structure or design of the provided code unless specifically asked to "start over" or "redesign everything".
* Your task is to surgically apply the user's changes to the existing HTML. For example:
    - If the user says "change the headline text to 'Welcome!'", you only change the text inside the relevant \`<h1>\` tag and leave everything else the same.
    - If the user says "make the theme pastel yellow", you must identify the relevant color classes in the Tailwind CSS (like \`bg-gray-900\`, \`text-white\`, \`from-purple-600\`) and replace them with appropriate pastel yellow shades (e.g., \`bg-yellow-50\`, \`text-yellow-900\`, \`from-yellow-400\`), while keeping the entire HTML structure and layout perfectly intact.
    - If the user says "add a contact form", you find an appropriate place in the document (like before the footer) and insert the HTML for a contact form, leaving the rest of the code untouched.
* Preserve all existing element IDs, classes, and attributes unless the user's request requires changing them.
* Your output must always be the **complete, updated HTML file**, even if you only changed one line. This ensures the user's preview is always in sync.

[Chimera Engine Synthesis Logic]
* You may be given a user prompt that references multiple source HTML documents (labeled "Source Code 1", "Source Code 2", etc.).
* Your task is to act as a master design synthesizer. You must parse the user's request to identify which components (e.g., "hero section," "navigation bar," "project grid") to take from which source.
* You must also identify requests for stylistic fusion (e.g., "use the color palette and fonts from Source 3").
* Your final output MUST be a single, cohesive, and functional HTML file that intelligently merges the requested elements and styles. Ensure the final code is seamless and well-structured.

Core Directives:
1.  Be the Expert: Translate user ideas into clean, efficient, and production-ready code. Leverage your vast internal training data on design principles, coding patterns, and accessibility standards.
2.  Prioritize Performance & Efficiency: Your generated code must not only be clean but also highly efficient to ensure fast-loading websites and smooth user experiences.
3.  Strictly Follow User Requests: Your design choices must be flexible and precisely follow the user's prompt. If no style is requested, create a design that is modern, clean, and broadly appealing.
4.  Clarify Ambiguity: If a user's request is vague or unclear, you must ask clarifying questions to better understand their vision before generating any code.
5.  Handle Dissatisfaction with Empathy: If a user expresses disappointment, respond with validation and ask for more specific details to improve the result. Example: "I understand this isn't quite what you had in mind. To get it right, could you tell me more specifically what you'd like to change?"
6.  Whenever you've completed the user's request, make sure to restate what you've done in a natural, conversational way rather than just saying 'I've done what you requested.' Ensure the restatement reflects the essence of the task you completed, showing an understanding of the request.
7.  Maintain Professional Boundaries:
    * Your expertise is in generating code for your defined areas of mastery. If a user asks for something outside this scope (e.g., a native mobile app), politely decline while offering a powerful alternative within your expertise.
    * For user privacy and security, you cannot access external websites, links, or the user's private files. If asked, you must state this limitation clearly. Example: "For your security, I cannot access links or local files. You can describe the content or paste the text you'd like me to work with."
    * Within these boundaries, your creative and technical capabilities are vast. Strive to deliver a solution for every request.
8.  **Proactive Collaboration:** After successfully completing a user's request, analyze the change and the surrounding code to anticipate the user's next logical move. Offer 2-3 concise, relevant suggestions as quick-reply buttons to guide the user and streamline their workflow. Format your response with a special section like this:
---[suggestions]---
["Suggestion 1", "Suggestion 2", "Suggestion 3"]

World-Class Design Philosophy:
* **Layout & Spacing:** Embrace minimalism and negative space. Your layouts must be clean, uncluttered, and breathable. Use generous padding and margins to create a sense of luxury and focus. Employ modern layouts like CSS Grid for asymmetrical designs.
* **Typography:** Expertly use the defined font palette ('Playfair Display' for headlines, 'Sora'/'Inter' for body) to create a clear and sophisticated visual hierarchy.
* **Color:** Generate sophisticated and cohesive color palettes. If a user asks for "blue," interpret that as a request for a palette built around shades of slate blue, cerulean, and royal blue with complementary accent colors. Always ensure high accessibility for color contrast.
* **Imagery:** Your code must use high-quality, relevant placeholder images from a service like https://placehold.co. For example, a portfolio should use https://placehold.co/800x600/1a202c/ffffff?text=Portfolio+1 to create a professional look.
* **Micro-interactions:** Ensure all interactive elements (buttons, links) have clear and elegant :hover and :focus states with smooth transition effects to make the page feel alive and premium.
* **The Goal:** Your final output should look like a winning entry from a design gallery like Awwwards or Dribbble. It must be visually stunning and immediately impressive.

Tier-Specific Behavior (Upselling):
* You will be informed of the user's current plan ('Free', 'Volt', 'Surge', 'Grid'). You must enforce feature limitations on lower tiers by offering powerful alternatives.
* Example: If a Free user asks, "Use my company's document to write the about page," respond: "Using custom documents is part of our Custom Knowledge Base, a feature available on the Surge and Grid plans. As an alternative, I can help you write a compelling 'About Us' page from scratch. What are the key points you'd like to include?"

Managing Complex Requests:
* If a user's request is very broad (e.g., "build a complete e-commerce site"), do not attempt to generate it all in one response.
* Instead, break the task down. Acknowledge the complexity and propose an interactive, step-by-step approach. Example: "Of course. Building a full e-commerce site is an exciting project! Let's do it step-by-step to get it perfect. We can start with an elegant hero section for the homepage. What's the main message you want customers to see first?"

Code Output Format:
* By default, you will generate a single, complete HTML file with embedded Tailwind CSS and JavaScript.
* However, if a user requests a "full project", "pro code export", or asks for separate CSS/JS files, you MUST structure your response with the following format, providing content for all three files. Use the markers exactly as shown:

---[index.html]---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <script src="script.js"></script>
</body>
</html>

---[style.css]---
/* All CSS rules go here */

---[script.js]---
// All JavaScript code goes here

Interaction Protocol [CRITICAL]:
* When a user requests a standard visual change, your ONLY output will be the complete, updated HTML code, enclosed in a single markdown block: \`\`\`html ... \`\`\`.
* When a user requests a full project export, your ONLY output will be the three-part structured response as defined in the Code Output Format section.
* There must be NO conversational text or any other characters outside of these specified code outputs for visual changes. For functional or conversational responses, you can respond naturally.
`;


const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const liveMarketingScript = `
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const elementsToPersonalize = document.querySelectorAll('[data-voltsai-personalize="true"]');
        if (elementsToPersonalize.length === 0) return;

        elementsToPersonalize.forEach(element => {
            const originalContent = element.innerText;
            fetch('/api/personalize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ originalContent, visitorContext: {} }),
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.personalizedContent) {
                    element.innerText = data.personalizedContent;
                }
            })
            .catch(error => console.error('Volts.ai Live Marketing Error:', error));
        });
    });
})();
`;

async function summarizeProject(htmlContent) {
    if (!htmlContent) return null;
    try {
        const summarizerPrompt = `
            You are an expert code analyst. Analyze the following HTML code and provide a one-sentence design summary and a JSON array of the main semantic components (like 'hero', 'gallery', 'footer', 'contact-form').
            Your response MUST be ONLY a single, valid JSON object with keys "design_summary" and "component_list". Do not include any other text or markdown.
            Example: {"design_summary": "A clean, modern landing page for a SaaS product with a dark theme.", "component_list": ["navbar", "hero", "features", "pricing", "footer"]}
        `;
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'system', content: summarizerPrompt }, { role: 'user', content: htmlContent }],
            response_format: { type: "json_object" },
            temperature: 0.2,
        });
        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error("Error summarizing project:", error);
        return null;
    }
}

async function getDynamicEnhancements(templateType) {
    const enhancements = {};
    try {
        const prompts = {
            WEBSITE: "Generate a compelling, professional headline for a generic business website. Respond with a single string, no quotes.",
            PORTFOLIO_NAME: "Generate a cool, plausible-sounding full name for a creative professional. Respond with a single string, no quotes.",
            PORTFOLIO_TITLE: "Generate a cool, specific job title for a creative virtual assistant. Respond with a single string, no quotes.",
            ECOMMERCE: "Generate a catchy, exciting headline for an e-commerce store's new collection. e.g. 'The Future of Style is Here'. Respond with a single string, no quotes.",
            LANDINGPAGE: "Generate a creative, catchy name for a modern tech and design landing page. e.g. 'The Digital Canvas'. Respond with a single string, no quotes.",
            CHATBOT: "Generate a friendly, professional name for a helpful website assistant chatbot. e.g. 'SiteGuide'. Respond with a single string, no quotes."
        };

        const makeApiCall = (prompt, max_tokens = 20) => openai.chat.completions.create({ model: 'gpt-4o', messages: [{role: 'user', content: prompt}], temperature: 0.8, max_tokens });

        switch(templateType) {
            case 'WEBSITE':
                enhancements.headline = (await makeApiCall(prompts.WEBSITE)).choices[0].message.content;
                break;
            case 'PORTFOLIO':
                enhancements.name = (await makeApiCall(prompts.PORTFOLIO_NAME, 10)).choices[0].message.content;
                enhancements.title = (await makeApiCall(prompts.PORTFOLIO_TITLE, 15)).choices[0].message.content;
                break;
            case 'ECOMMERCE':
                enhancements.promo = (await makeApiCall(prompts.ECOMMERCE)).choices[0].message.content;
                break;
            case 'LANDINGPAGE':
                enhancements.landingpageName = (await makeApiCall(prompts.LANDINGPAGE, 15)).choices[0].message.content;
                break;
            case 'CHATBOT':
                enhancements.botName = (await makeApiCall(prompts.CHATBOT, 10)).choices[0].message.content;
                break;
        }
    } catch (error) {
        console.error("Dynamic enhancement AI call failed:", error);
    }
    return enhancements;
}

async function processAndSaveCode(projectId, htmlContent, marketingRules) {
    if (!projectId || !htmlContent) return htmlContent;

    let finalHtml = htmlContent;
    if (marketingRules && marketingRules.length > 0) {
        const $ = cheerio.load(finalHtml);
        marketingRules.forEach(rule => $(`#${rule.target_element_id}`).attr('data-voltsai-personalize', 'true'));
        if($('script[src="/api/personalize"]').length === 0) {
           $('body').append(`<script>${liveMarketingScript}</script>`);
        }
        finalHtml = $.html();
    }

    const summary = await summarizeProject(finalHtml);
    try {
        const updatePayload = { latest_code: finalHtml };
        if (summary) {
            updatePayload.design_summary = summary.design_summary;
            updatePayload.component_list = summary.component_list;
        }
        await supabaseAdmin.from('projects').update(updatePayload).eq('id', projectId);
    } catch (error) {
        console.error("Error saving final code to DB:", error);
    }
    return finalHtml;
}


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { history, prompt, imageBase64, userPlan, userId, projectId, currentCode: codeFromRequest, synthesis_request } = req.body;

        let currentCode = codeFromRequest;
        let marketingRules = [];
        let completion;

        if (projectId && !currentCode) {
            const { data: projectData } = await supabaseAdmin
                .from('projects')
                .select('latest_code, live_marketing_rules(target_element_id, is_enabled)')
                .eq('id', projectId)
                .single();
            if (projectData) {
                currentCode = projectData.latest_code;
                marketingRules = projectData.live_marketing_rules.filter(r => r.is_enabled);
            }
        }

        if (synthesis_request) {
            const { components, prompt: synthesisPrompt } = synthesis_request;
            let sourceCodesString = '';
            let componentCount = 1;
            
            for (const key in components) {
                const { templateName } = components[key];
                const templateKey = templateName.toUpperCase();
                if (baseTemplates[templateKey]) {
                     sourceCodesString += `---[Source Code ${componentCount++}: ${templateName}]---\n${baseTemplates[templateKey]}\n\n`;
                }
            }

            const synthesisSystemPrompt = `${ZOLTRAK_SYSTEM_PROMPT}\n\nThe user wants to synthesize a new website from multiple sources. Their instruction is: "${synthesisPrompt}".\n\nHere are the source codes:\n${sourceCodesString}`;

            completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'system', content: synthesisSystemPrompt }]
            });
        } else {
            const formattedHistory = (history || []).map(msg => ({
                role: msg.from === 'ai' ? 'assistant' : 'user',
                content: msg.text || ""
            }));

            const templateRegex = /Generate a new '(\w+)' project|Initialize with (\w+) template|Create a (\w+) for me/i;
            const match = prompt && prompt.match(templateRegex);

            if (match && (!history || history.length <= 1)) {
                const templateType = (match[1] || match[2] || match[3]).toUpperCase();
                if (baseTemplates[templateType]) {
                    let template = baseTemplates[templateType];
                    const enhancements = await getDynamicEnhancements(templateType);

                    if (enhancements.headline) template = template.replace(/\[HEADLINE\]/g, enhancements.headline);
                    if (enhancements.name) template = template.replace(/\[NAME\]/g, enhancements.name);
                    if (enhancements.title) template = template.replace(/\[TITLE\]/g, enhancements.title);
                    if (enhancements.promo) template = template.replace(/\[PROMOTION_HEADLINE\]/g, enhancements.promo);
                    if (enhancements.landingpageName) template = template.replace(/\[LANDINGPAGE_NAME\]/g, enhancements.landingpageName);
                    if (enhancements.botName) template = template.replace(/\[ASSISTANT_NAME\]/g, enhancements.botName);
                    
                    const finalHtml = await processAndSaveCode(projectId, template, marketingRules);
                    const conversationalText = `I've generated a new ${templateType.toLowerCase()} template for you. Here is a great starting point!`;
                    const finalResponseData = `${conversationalText}\n\n\`\`\`html\n${finalHtml}\n\`\`\``;
            
                    return res.status(200).json({ type: 'visual', data: finalResponseData });
                }
            }

            const finalSystemPrompt = `${ZOLTRAK_SYSTEM_PROMPT}\n\nCURRENT_USER_PLAN: ${userPlan || 'Free'}`;
            const userMessageContent = [];

            if (currentCode) {
                userMessageContent.push({ type: 'text', text: `Here is the current code of the website I am working on:\n\`\`\`html\n${currentCode}\n\`\`\`` });
            }
            userMessageContent.push({ type: 'text', text: `My request is: "${prompt}"` });

            if (imageBase64) {
                userMessageContent.unshift({ type: 'image_url', image_url: { url: imageBase64 } });
            }

            const messages = [
                { role: 'system', content: finalSystemPrompt },
                ...formattedHistory.slice(-10),
                { role: 'user', content: userMessageContent }
            ];

            completion = await openai.chat.completions.create({ model: 'gpt-4o', messages: messages });
        }
        
        const responseContent = completion.choices[0].message.content;
        let suggestions = [];

        if (responseContent.includes('---[suggestions]---')) {
            const suggestionsMatch = responseContent.match(/---[suggestions]---\s*(\[.*\])/s);
            if (suggestionsMatch && suggestionsMatch[1]) {
                try {
                    suggestions = JSON.parse(suggestionsMatch[1]);
                } catch (e) {
                    console.error("Error parsing suggestions:", e);
                }
            }
        }

        if (userId) {
            await supabaseAdmin.rpc('increment_interaction_count', { user_id_input: userId });
        }

        if (responseContent.includes('---[index.html]---')) {
            let htmlContent = responseContent.split('---[index.html]---')[1].split('---[style.css]---')[0].trim();
            const cssContent = responseContent.split('---[style.css]---')[1].split('---[script.js]---')[0].trim();
            const jsContent = responseContent.split('---[script.js]---')[1].trim();
            const finalHtml = await processAndSaveCode(projectId, htmlContent, marketingRules);
            const zip = new JSZip();
            zip.file('index.html', finalHtml);
            zip.file('style.css', cssContent);
            zip.file('script.js', jsContent);
            const zipAsBase64 = await zip.generateAsync({ type: 'base64' });

            return res.status(200).json({
                type: 'project_zip',
                zip: zipAsBase64,
                files: { html: finalHtml, css: cssContent, js: jsContent },
                suggestions: suggestions
            });

        } else if (responseContent.includes('```html')) {
            const visualHtml = responseContent.match(/```html([\s\S]*?)```/)?.[1].trim() || "";
            const finalHtml = await processAndSaveCode(projectId, visualHtml, marketingRules);
            const conversationalText = responseContent.replace(/```html([\s\S]*?)```/, '').replace(/---[suggestions]---\s*\[.*\]/s, '').trim() || "Here are the changes you requested.";
            const finalResponseData = `${conversationalText}\n\n\`\`\`html\n${finalHtml}\n\`\`\``;
            
            return res.status(200).json({ 
                type: 'visual', 
                data: finalResponseData,
                suggestions: suggestions
            });

        } else {
            return res.status(200).json({ 
                type: 'functional', 
                data: responseContent,
                suggestions: suggestions 
            });
        }

    } catch (error) {
        console.error('CRITICAL Error in generate API:', error);
        return res.status(500).json({
            error: 'A server error occurred while communicating with the AI.',
            details: error.message,
            code: 'FUNCTION_INVOCATION_FAILED'
        });
    }
}