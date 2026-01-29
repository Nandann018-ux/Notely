const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getAIResponse = async (prompt, systemInstruction) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

exports.summarize = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Content is required' });

        const systemPrompt = "You are an AI note assistant. Summarize the provided note content concisely. Return ONLY a JSON object: { \"summary\": \"your summary here\" }";
        const response = await getAIResponse(`Summarize this note: ${content}`, systemPrompt);
        const jsonStr = response.replace(/```json|```/g, '').trim();
        res.json(JSON.parse(jsonStr));
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'AI processing failed' });
    }
};

exports.generateTitle = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Content is required' });

        const systemPrompt = "You are an AI note assistant. Suggest a short, punchy title for the note. Return ONLY a JSON object: { \"title\": \"suggested title\" }";
        const response = await getAIResponse(`Generate a title for this: ${content}`, systemPrompt);

        const jsonStr = response.replace(/```json|```/g, '').trim();
        res.json(JSON.parse(jsonStr));
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'AI processing failed' });
    }
};

exports.suggestTags = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Content is required' });

        const systemPrompt = "You are an AI note assistant. Suggest 3-5 relevant tags for the note. Return ONLY a JSON object: { \"tags\": [\"tag1\", \"tag2\"] }";
        const response = await getAIResponse(`Suggest tags for this: ${content}`, systemPrompt);

        const jsonStr = response.replace(/```json|```/g, '').trim();
        res.json(JSON.parse(jsonStr));
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'AI processing failed' });
    }
};
