require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const port = process.env.PORT || 3000;
const groqApiKey = process.env.GROQ_API_KEY || process.env["GROQ-API-KEY"];

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

if (!groqApiKey) {
    throw new Error("Missing Groq API key. Set GROQ_API_KEY or GROQ-API-KEY in .env.");
}

const groq = new Groq({
    apiKey: groqApiKey,
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: userMessage,
                },
                {
                    role: "system",
                    content: "you are a friendly helper dont use markdown just plain text ! , . ? and numbers",
                },
            ],
        });

        res.json({
            reply: response.choices[0].message.content,
        });

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
