import express from "express";
import keralaDistrictCoords from "./districtCoords.ts";
 // add .js extension if using ESM

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const district = String(req.query.district || "");
    if (!district) return res.status(400).json({ error: "district required" });

    const coords = keralaDistrictCoords[district];
    if (!coords) return res.status(400).json({ error: "unknown district" });

    const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${coords.lat},${coords.lon}&aqi=no`;

    const r = await fetch(url); // ✅ native fetch
    if (!r.ok) return res.status(502).json({ error: "Weather API error" });

    const data = await r.json();

    // Normalize into frontend shape
    const payload = {
      provider: "weatherapi.com",
      fetchedAt: new Date().toISOString(),
      raw: data,
      current: {
        temperature_2m: data.current?.temp_c ?? null,
        relative_humidity_2m: data.current?.humidity ?? null,
        wind_speed_10m: data.current?.wind_kph ?? null,
        precipitation: data.current?.precip_mm ?? null,
        cloudcover: data.current?.cloud ?? null,
      },
    };

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

export default router;
