const express = require("express");
const { OpenAI } = require("openai"); // Correct import for newer versions
const router = express.Router();

// Initialize OpenAI with API key from .env
const openai = new OpenAI({
    apiKey: process.env.API_KEY, // Ensure this is set in your .env file
});

// Endpoint for ChatGPT API calls
router.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Updated model name (ensure you have access)
            messages: [
                {
                    role: "system",
                    content:
                        "You are a career advisor providing personalized learning and skill recommendations.",
                },
                { role: "user", content: message },
            ],
            max_tokens: 200,
        });

        if (!response.choices || response.choices.length === 0) {
            return res.status(500).send("No response from ChatGPT");
        }

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("ChatGPT API error:", error.message);
        res.status(500).send("Error communicating with ChatGPT");
    }
});

module.exports = router;
