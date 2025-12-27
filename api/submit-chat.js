const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: `You are Charlie, the friendly assistant for Start Right UK (start-right.uk). You help people start businesses in the UK - limited companies, sole traders, LLPs, and partnerships. Be warm, helpful, and British. Keep responses concise. If they're ready to start, guide them to our packages.`,
      messages: [
        { role: 'user', content: message }
      ]
    });

    res.status(200).json({ 
      reply: response.content[0].text 
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
