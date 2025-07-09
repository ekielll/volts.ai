import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // We only want to handle POST requests for this endpoint
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { originalContent, visitorContext } = req.body;

    // Basic validation
    if (!originalContent) {
      return res.status(400).json({ error: 'originalContent is required.' });
    }

    // The System Prompt that defines the AI's role as a personalization expert.
    // This is engineered to be concise and powerful for this specific task.
    const systemPrompt = `You are an expert marketing copywriter and conversion rate optimization specialist. Your task is to rewrite website content in real-time to personalize it for the current visitor.
- Analyze the visitor context (if provided).
- Analyze the original text.
- Rewrite the text to be more engaging, persuasive, and relevant to a general audience, or to the specific visitor profile if context is available.
- IMPORTANT: Only return the rewritten text, with no extra explanations, labels, or quotation marks. The output must be clean text, ready to be injected directly into a website's HTML.`;

    // For now, visitorContext is a placeholder. In the future, it could contain
    // data like { "source": "social_media", "device": "mobile" }
    const userMessage = `Original Content: "${originalContent}"
Visitor Context: ${JSON.stringify(visitorContext || 'General Audience')}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7, // Allows for creative but still relevant copy
      max_tokens: 150,  // Sufficient for headlines and short paragraphs
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const personalizedContent = response.choices[0].message.content.trim();

    // Send the personalized content back to the client
    return res.status(200).json({ personalizedContent });

  } catch (error) {
    console.error('Error in /api/personalize:', error);
    return res.status(500).json({ error: 'Failed to generate personalized content.' });
  }
}