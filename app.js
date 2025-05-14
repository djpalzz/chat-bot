require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat:free";

app.post("/chat", async (req, res) => {
    const userMsg = req.body.usermsg;
    try {
        const response = await axios.post(
            API_URL,
            {
                model: MODEL,
                messages: [
                    { role: "user", content: userMsg }
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.chat_bot_key}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "Content-Type": "application/json",
                },
            },
        );
        
        if(response.status == 200){
            const  reply =  response.data.choices[0].message.content || response.data.choices[0].text || response.data.choices[0].generated_text;
            res.json({reply});
        }
        //const reply = response.data.choices[0].message.content || response.data.choices[0].text || response.data.choices[0].generated_text;


        
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get response from OpenRouter" });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
