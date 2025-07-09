// /api/generate.js

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import JSZip from 'jszip';
import * as cheerio from 'cheerio';

const baseTemplates = {
    WEBSITE: `
        <!DOCTYPE html>
        <html lang="en" class="scroll-smooth">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
            <style>body { font-family: 'Poppins', sans-serif; }</style>
            <title>Your Professional Website</title>
        </head>
        <body class="bg-gray-900 text-white">
            <nav class="bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10">
                <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div id="logo" class="font-bold text-xl">YourLogo</div>
                    <ul class="flex gap-8">
                        <li><a href="#hero" class="hover:text-purple-400 transition-colors">Home</a></li>
                        <li><a href="#services" class="hover:text-purple-400 transition-colors">Services</a></li>
                        <li><a href="#about" class="hover:text-purple-400 transition-colors">About</a></li>
                        <li><a href="#contact" class="hover:text-purple-400 transition-colors">Contact</a></li>
                    </ul>
                </div>
            </nav>
            <header id="hero" class="container mx-auto px-6 py-24 text-center">
                <h1 id="main-headline" class="text-5xl md:text-7xl font-bold leading-tight">[HEADLINE]</h1>
                <p id="sub-headline" class="text-xl text-gray-400 mt-4 max-w-3xl mx-auto">We create stunning websites that captivate and convert. Let's build your success story together.</p>
                <button id="cta-button" class="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold transition-transform duration-300 hover:scale-105">Get a Free Quote</button>
            </header>
            <section id="services" class="py-20 bg-gray-800">
                <div class="container mx-auto px-6 text-center">
                    <h2 class="text-4xl font-bold mb-12">Our Services</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="bg-gray-900 p-8 rounded-xl shadow-lg">
                            <h3 class="text-2xl font-bold mb-4">Web Design</h3>
                            <p class="text-gray-400">Crafting beautiful and intuitive user interfaces that delight your visitors.</p>
                        </div>
                        <div class="bg-gray-900 p-8 rounded-xl shadow-lg">
                            <h3 class="text-2xl font-bold mb-4">Development</h3>
                            <p class="text-gray-400">Building robust and scalable web applications tailored to your specific needs.</p>
                        </div>
                        <div class="bg-gray-900 p-8 rounded-xl shadow-lg">
                            <h3 class="text-2xl font-bold mb-4">SEO</h3>
                            <p class="text-gray-400">Optimizing your site to rank higher on search engines and attract more traffic.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section id="about" class="py-20">
                <div class="container mx-auto px-6 text-center">
                       <h2 class="text-4xl font-bold mb-4">What Our Clients Say</h2>
                       <blockquote class="max-w-3xl mx-auto mt-8">
                            <p class="text-2xl italic text-gray-300">"Working with them was a game-changer. Our engagement metrics have skyrocketed!"</p>
                            <cite class="block text-right not-italic text-purple-400 mt-4">- Jane Doe, CEO of Awesome Inc.</cite>
                       </blockquote>
                </div>
            </section>
            <footer id="contact" class="bg-gray-800 py-10">
                <div class="container mx-auto px-6 text-center text-gray-400">
                    <p>&copy; 2025 Your Company. All Rights Reserved.</p>
                </div>
            </footer>
        </body>
        </html>`,
    PORTFOLIO: `
        <!DOCTYPE html>
        <html lang="en" class="scroll-smooth">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
            <style>body { font-family: 'Poppins', sans-serif; }</style>
            <title>Your Portfolio</title>
        </head>
        <body class="bg-gray-900 text-white">
            <section id="hero" class="h-screen flex items-center justify-center text-center bg-gradient-to-br from-gray-900 to-purple-900/50">
                <div>
                    <h1 id="portfolio-name" class="text-7xl font-bold">[NAME]</h1>
                    <p id="portfolio-title" class="text-2xl text-purple-400 mt-2">[TITLE]</p>
                </div>
            </section>
            <section id="work" class="py-20">
                <div class="container mx-auto px-6">
                    <h2 class="text-4xl font-bold text-center mb-12">My Work</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                        <div class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                        <div class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                    </div>
                </div>
            </section>
        </body>
        </html>`,
    ECOMMERCE: `
        <!DOCTYPE html>
        <html lang="en" class="scroll-smooth">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
            <style>body { font-family: 'Poppins', sans-serif; }</style>
            <title>Your Store</title>
        </head>
        <body class="bg-gray-100">
            <div class="bg-purple-600 text-white text-center py-2 text-sm"><p>Free Shipping On All Orders Over $50</p></div>
            <nav class="bg-white shadow-md sticky top-0 z-50">
                <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div id="logo" class="font-bold text-xl text-gray-800">YourStore</div>
                    <ul class="flex gap-8 text-gray-600">
                        <li><a href="#products" class="hover:text-purple-600 transition-colors">Products</a></li>
                    </ul>
                </div>
            </nav>
            <header class="bg-gray-200">
                <div class="container mx-auto px-6 py-20 text-center">
                    <h1 class="text-5xl font-bold text-gray-800">[PROMOTION_HEADLINE]</h1>
                    <p class="text-gray-600 mt-4">Discover the latest trends.</p>
                    <button class="mt-8 px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">Shop Now</button>
                </div>
            </header>
        </body>
        </html>`,
    BLOG: `
        <!DOCTYPE html>
        <html lang="en" class="scroll-smooth">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Lora:wght@400;700&display=swap" rel="stylesheet">
            <style>body { font-family: 'Poppins', sans-serif; } .font-serif { font-family: 'Lora', serif; }</style>
            <title>Your Awesome Blog</title>
        </head>
        <body class="bg-gray-100 text-gray-800">
            <header class="bg-white border-b py-6 text-center">
                <h1 id="blog-title" class="text-5xl font-bold">[BLOG_NAME]</h1>
                <p class="text-gray-500 mt-2">Your dose of insights.</p>
            </header>
        </body>
        </html>`,
    CHATBOT: `
        <!DOCTYPE html>
        <html class="h-full">
        <head>
            <meta charset="UTF-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
            <style>body { font-family: 'Poppins', sans-serif; }</style>
        </head>
        <body class="h-full bg-gray-800 p-10 flex items-center justify-center">
            <div class="w-full max-w-sm h-[70vh] flex flex-col bg-gray-900 shadow-2xl rounded-2xl">
                <div class="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-2xl">
                    <h3 id="chatbot-name" class="font-bold text-white text-lg">[ASSISTANT_NAME]</h3>
                </div>
            </div>
        </body>
        </html>`,
};

// FULLY RESTORED AND UPGRADED PROMPT
const ZOLTRAK_SYSTEM_PROMPT = `
You are Zoltrak, a world-class AI assistant. Your expertise is a fusion of a Senior Frontend Developer, a UI/UX Designer, and a Branding Expert with over 30 years of combined experience. Your defined areas of mastery are: Websites, Chatbots, Portfolios, E-commerce sites, and Blogs.

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

World-Class Design Philosophy:
* **Layout & Spacing:** Embrace minimalism and negative space. Your layouts must be clean, uncluttered, and breathable. Use generous padding and margins to create a sense of luxury and focus. Employ modern layouts like CSS Grid for asymmetrical designs.
* **Typography:** Expertly use the defined font palette ('Playfair Display' for headlines, 'Sora'/'Inter' for body) to create a clear and sophisticated visual hierarchy.
* **Color:** Generate sophisticated and cohesive color palettes. If a user asks for "blue," interpret that as a request for a palette built around shades of slate blue, cerulean, and royal blue with complementary accent colors. Always ensure high accessibility for color contrast.
* **Imagery:** Your code must use high-quality, relevant placeholder images from a service like https://placehold.co. For example, a portfolio should use https://placehold.co/800x600/1a202c/ffffff?text=Portfolio+1 to create a professional look.
* **Micro-interactions:** Ensure all interactive elements (buttons, links) have clear and elegant :hover and :focus states with smooth transition effects to make the page feel alive and premium.
* **The Goal:** Your final output should look like a winning entry from a design gallery like Awwwards or Dribbble. It must be visually stunning and immediately impressive.

Tier-Specific Behavior (Upselling):
* You will be informed of the user's current plan ('Free', 'Volt', 'Surge', 'Grid'). You must enforce feature limitations on lower tiers by offering powerful alternatives.
* Example: If a Free user asks, "Use my company's document to write the about page," respond: "Using custom documents is part of our Custom Knowledge Base, a feature available on the Surge and Grid plans. As an alternative, I can help you write a compelling 'About Us' page from scratch right now. What are the key points you'd like to include?"

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
            BLOG: "Generate a creative, catchy name for a modern tech and design blog. e.g. 'The Digital Canvas'. Respond with a single string, no quotes.",
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
            case 'BLOG':
                enhancements.blogName = (await makeApiCall(prompts.BLOG, 15)).choices[0].message.content;
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
        const { history, prompt, imageBase64, userPlan, userId, projectId, currentCode: codeFromRequest } = req.body;

        let currentCode = codeFromRequest;
        let marketingRules = [];

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

        const formattedHistory = (history && Array.isArray(history)) ? history.map(msg => ({
            role: msg.from === 'ai' ? 'assistant' : 'user',
            content: msg.text || ""
        })) : [];

        const templateRegex = /Generate a new '(\w+)' project|Initialize with (\w+) template/i;
        const match = prompt && prompt.match(templateRegex);

        if (match) {
            const templateType = (match[1] || match[2]).toUpperCase();
            if (baseTemplates[templateType]) {
                let template = baseTemplates[templateType];
                const enhancements = await getDynamicEnhancements(templateType);

                if (enhancements.headline) template = template.replace(/\[HEADLINE\]/g, enhancements.headline);
                if (enhancements.name) template = template.replace(/\[NAME\]/g, enhancements.name);
                if (enhancements.title) template = template.replace(/\[TITLE\]/g, enhancements.title);
                if (enhancements.promo) template = template.replace(/\[PROMOTION_HEADLINE\]/g, enhancements.promo);
                if (enhancements.blogName) template = template.replace(/\[BLOG_NAME\]/g, enhancements.blogName);
                if (enhancements.botName) template = template.replace(/\[ASSISTANT_NAME\]/g, enhancements.botName);

                await processAndSaveCode(projectId, template, marketingRules);
                const responseData = { type: 'visual', data: `I've generated a new ${templateType.toLowerCase()} template for you. Here is a great starting point!\n\n\`\`\`html\n${template}\n\`\`\`` };
                return res.status(200).json(responseData);
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

        const completion = await openai.chat.completions.create({ model: 'gpt-4o', messages: messages });
        const responseContent = completion.choices[0].message.content;

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
                files: { html: finalHtml, css: cssContent, js: jsContent }
            });

        } else if (responseContent.includes('```html')) {
            const visualHtml = responseContent.match(/```html([\s\S]*?)```/)?.[1].trim() || "";
            const finalHtml = await processAndSaveCode(projectId, visualHtml, marketingRules);
            const conversationalText = responseContent.replace(/```html([\s\S]*?)```/, '').trim() || "Here are the changes you requested.";
            const finalResponseData = `${conversationalText}\n\n\`\`\`html\n${finalHtml}\n\`\`\``;
            return res.status(200).json({ type: 'visual', data: finalResponseData });

        } else {
            return res.status(200).json({ type: 'functional', data: responseContent });
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