const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message);
    console.log('Using API Key:', process.env.API_KEY ? 'Present' : 'Missing');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that provides clear and concise responses."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    console.log('OpenAI Response:', response);
    res.json({ response });
  } catch (error) {
    console.error('Detailed Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
});

module.exports = router;
