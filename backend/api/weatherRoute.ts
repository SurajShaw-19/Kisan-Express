import express from "express";
import keralaDistrictCoords from "./districtCoords.js"; // ESM: include .js
import dotenv from "dotenv";
import fetch from "node-fetch"; // if using Node 18+, global fetch is available

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const district = String(req.query.district || "");
    const area = typeof req.query.area === "string" ? req.query.area : "";

    if (!district) {
      return res.status(400).json({ error: "district required" });
    }

    const coords = keralaDistrictCoords[district];
    if (!coords) {
      return res.status(400).json({ error: "unknown district" });
    }

    const weatherApiKey = process.env.WEATHER_API_KEY;
    let provider = "";
    let data: any;
    let fromWeatherApi = false;

    // Try weatherapi.com if API key exists
    if (weatherApiKey) {
      try {
        const q = area
          ? encodeURIComponent(`${area}, ${district}, Kerala, India`)
          : `${coords.lat},${coords.lon}`;
        const url = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${q}&aqi=no`;
        const r = await fetch(url);
        if (r.ok) {
          provider = "weatherapi.com";
          data = await r.json();
          fromWeatherApi = true;
        }
      } catch (err) {
        console.warn("weatherapi.com failed, falling back to Open-Meteo", err);
      }
    }

    // Fallback: open-meteo
    if (!fromWeatherApi) {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
      const r = await fetch(url);
      if (!r.ok) return res.status(502).json({ error: "Open-Meteo error" });
      provider = "open-meteo";
      data = await r.json();
    }

    // Normalize data for frontend
    const current =
      provider === "weatherapi.com"
        ? {
            temperature_2m: data.current?.temp_c ?? null,
            relative_humidity_2m: data.current?.humidity ?? null,
            wind_speed_10m: data.current?.wind_kph ?? null,
            precipitation: data.current?.precip_mm ?? null,
            cloudcover: data.current?.cloud ?? null,
          }
        : {
            temperature_2m: data.current_weather?.temperature ?? null,
            relative_humidity_2m: null,
            wind_speed_10m: data.current_weather?.windspeed ?? null,
            precipitation: null,
            cloudcover: null,
          };

    const payload = {
      provider,
      fetchedAt: new Date().toISOString(),
      raw: data,
      current,
    };

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

export default router;
