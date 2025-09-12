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

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      const t = weather.current?.temperature_2m ?? 28;
      const p = weather.current?.precipitation ?? 2;
      const recs: { crop: string; score: number; reasoning: string; plantingWindow: string }[] = [];
      if (t >= 24 && t <= 34 && p >= 1) {
        recs.push({ crop: "Rice (short-duration)", score: 0.88, reasoning: "Warm temps with moisture favor paddy establishment", plantingWindow: "Next 2–3 weeks" });
      }
      if (t >= 22 && t <= 32 && p <= 3) {
        recs.push({ crop: "Banana (Nendran)", score: 0.82, reasoning: "Kerala-suited cultivar; tolerant to intermittent showers", plantingWindow: "Next 4 weeks" });
      }
      if (t >= 20 && t <= 30) {
        recs.push({ crop: "Vegetables (okra/chili)", score: 0.76, reasoning: "Favorable for quick rotation vegetables", plantingWindow: "Next 1–2 weeks" });
      }
      if (p >= 3) {
        recs.push({ crop: "Taro (Colocasia)", score: 0.7, reasoning: "Handles wetter fields well", plantingWindow: "This month" });
      }
      if (recs.length < 3) {
        recs.push({ crop: "Coconut intercropping", score: 0.65, reasoning: "Low-risk perennial base with intercrops", plantingWindow: "Anytime" });
      }
      return res.json({ recommendations: recs.slice(0, 5), method: "heuristic" });
    }

    // ✅ use native fetch (Node 18+)
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + key,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!geminiResponse.ok) {
      // Fallback to heuristic if Gemini fails
      const t = weather.current?.temperature_2m ?? 28;
      const p = weather.current?.precipitation ?? 2;
      const recs: { crop: string; score: number; reasoning: string; plantingWindow: string }[] = [];
      if (t >= 24 && t <= 34 && p >= 1) recs.push({ crop: "Rice (short-duration)", score: 0.88, reasoning: "Warm temps with moisture favor paddy establishment", plantingWindow: "Next 2–3 weeks" });
      if (t >= 22 && t <= 32 && p <= 3) recs.push({ crop: "Banana (Nendran)", score: 0.82, reasoning: "Kerala-suited cultivar; tolerant to intermittent showers", plantingWindow: "Next 4 weeks" });
      if (t >= 20 && t <= 30) recs.push({ crop: "Vegetables (okra/chili)", score: 0.76, reasoning: "Favorable for quick rotation vegetables", plantingWindow: "Next 1–2 weeks" });
      if (p >= 3) recs.push({ crop: "Taro (Colocasia)", score: 0.7, reasoning: "Handles wetter fields well", plantingWindow: "This month" });
      if (recs.length < 3) recs.push({ crop: "Coconut intercropping", score: 0.65, reasoning: "Low-risk perennial base with intercrops", plantingWindow: "Anytime" });
      return res.json({ recommendations: recs.slice(0, 5), method: "heuristic" });
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
