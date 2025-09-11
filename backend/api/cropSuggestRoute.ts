import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { district, coords, weather } = req.body;
    if (!district || !coords || !weather) {
      return res.status(400).json({ error: "district, coords and weather required" });
    }

    const prompt = `
You are an agronomist advising Kerala farmers in ${district}.
Here is the current weather JSON:
${JSON.stringify(weather, null, 2)}

Suggest 3-5 suitable crops to grow NOW that can give high profit.
Output JSON in this format only:
{
  "recommendations": [
    { "crop": "Crop name", "score": 0.9, "reasoning": "why suitable", "plantingWindow": "when to plant" }
  ],
  "method": "gemini"
}
    `;

    // ✅ use native fetch (Node 18+)
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!geminiResponse.ok) {
      return res.status(502).json({ error: "Gemini API error" });
    }

    const result = await geminiResponse.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ✅ sanitize fenced code blocks
    let clean = text.trim();
    if (clean.startsWith("```")) {
      clean = clean.replace(/```[a-z]*\n?/i, "").replace(/```$/, "").trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      parsed = { recommendations: [], method: "gemini", rawText: text };
    }

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

export default router;
