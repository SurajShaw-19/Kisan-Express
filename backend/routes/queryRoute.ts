import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const body: any = req.body || {};

    const type = String(body.type || "text");
    const content = String(body.content || "").trim();
    const category = String(body.category || "general");
    const farmerId = String(body.farmerId || "anonymous");
    const language = String(body.language || "en");

    if (!content && !req.file) {
      return res.status(400).json({ error: "Either content or image is required" });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      const fallback = `Here are practical suggestions based on your ${category} query:\n\n1) Assess the issue carefully (symptoms, duration, spread).\n2) Immediate steps: remove severely affected parts, improve field hygiene, and avoid over-watering.\n3) Preventive tips: follow crop rotation, use certified seeds, monitor pests weekly, and maintain soil health.\n4) Seek local expert help if the problem worsens or affects more than 20% of plants.\n\nNote: Add GEMINI_API_KEY to enable AI-generated responses.`;
      return res.json({ success: true, id: Date.now().toString(), answer: fallback, model: "heuristic" });
    }

    const langName = language === "ml" ? "Malayalam" : language === "hi" ? "Hindi" : "English";

    const basePrompt = `You are a helpful agricultural expert. A farmer (id: ${farmerId}) has a ${category} query.\n\nQuestion: ${content || "(image-based question)"}\n\nProvide a clear, practical answer with: 1) likely cause/diagnosis, 2) immediate steps, 3) preventive tips, 4) when to seek expert help. Respond ONLY in ${langName}.`;

    let model = "gemini-pro";
    let parts: any[] = [{ text: basePrompt }];

    if (req.file && (type === "image" || req.file.mimetype.startsWith("image/"))) {
      model = "gemini-1.5-flash-latest";
      const base64 = req.file.buffer.toString("base64");
      parts = [
        {
          inlineData: {
            mimeType: req.file.mimetype || "image/jpeg",
            data: base64,
          },
        },
        { text: basePrompt },
      ];
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }] }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API Error:", errorText);
      const fallback = `Here are practical, non-AI suggestions based on your ${category} query:\n\n1) Diagnose: observe symptoms, check leaves/stems/roots, note duration.\n2) Immediate steps: remove heavily affected parts, sanitize tools, improve aeration/drainage.\n3) Preventive: balanced NPK, proper spacing, crop rotation, recommended resistant varieties.\n4) Seek local agri officer if spread increases.`;
      return res.json({ success: true, id: Date.now().toString(), answer: fallback, model: "gemini_error_fallback" });
    }

    const result = await geminiResponse.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return res.json({
      success: true,
      id: Date.now().toString(),
      answer: text.trim(),
      model,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;