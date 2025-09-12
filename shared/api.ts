// shared/api.ts

export type AlertSeverity = "low" | "medium" | "high";

export type AlertType = "weather" | "pest" | "disease" | "price";

export interface AlertItem {
  id: string;
  district: string;
  state: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  type: AlertType;
  createdAt: string;  // ISO timestamp
  validUntil: string; // ISO timestamp
}

export interface DailyForecast {
  date: string; // ISO date
  tmax: number | null;
  tmin: number | null;
  precipitation_mm: number | null;
  condition: string | null; // e.g., "rain", "cloudy", "thunderstorm"
}

export interface HourlyForecastPoint {
  time: string; // ISO timestamp
  temp: number | null;
  precipitation: number | null;
  wind_kmh: number | null;
}

export interface WeatherResponse {
  provider: string;
  fetchedAt: string;
  raw: any;
  current: {
    temperature_2m: number | null;
    relative_humidity_2m: number | null;
    wind_speed_10m: number | null;
    precipitation: number | null;
    cloudcover: number | null;
  };
  forecast?: {
    daily: DailyForecast[];
    hourly: HourlyForecastPoint[];
  };
}

export interface CropSuggestionResponse {
  recommendations: {
    crop: string;
    score: number;
    reasoning: string;
    plantingWindow: string;
  }[];
  method: string;
  rawText?: string;
}
