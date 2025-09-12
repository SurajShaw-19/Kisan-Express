import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, question, language } = req.body;

    if (!name || !email || !question || !language) {
      return res.status(400).json({ error: "All fields including language are required" });
    }

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      return res.status(400).json({ error: "Question cannot be empty" });
    }

    const key = process.env.GEMINI_API_KEY;

    const prompt = `
You are an agricultural expert. A farmer has asked:

"${trimmedQuestion}"

Respond ONLY in ${language === "ml" ? "Malayalam" : "English"}.
`;

    // Call Gemini API
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + key,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API Error:", errorText);
      return res.status(500).json({ error: "Gemini API error" });
    }

    const result = await geminiResponse.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({
      success: true,
      answer: text.trim(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
