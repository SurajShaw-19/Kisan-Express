import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Cloud, Bug, Thermometer, TrendingUp, MapPin, Calendar, Filter, Leaf, RefreshCw } from "lucide-react";
import { useFarmerStore } from "@/store/farmerStore";
import type { AlertItem, AlertSeverity, AlertType, WeatherResponse, CropSuggestionResponse } from "@shared/api";

// -- Quick district -> approximate lat/lon mapping (use backend geocoding for production)
const keralaDistrictCoords: Record<string, { lat: number; lon: number }> = {
  "Thiruvananthapuram": { lat: 8.524139, lon: 76.936638 },
  "Kollam": { lat: 8.893212, lon: 76.614136 },
  "Alappuzha": { lat: 9.498066, lon: 76.338493 },
  "Pathanamthitta": { lat: 9.264500, lon: 76.787000 },
  "Kottayam": { lat: 9.591566, lon: 76.522116 },
  "Idukki": { lat: 9.878620, lon: 77.168903 },
  "Ernakulam": { lat: 9.981634, lon: 76.299872 },
  "Thrissur": { lat: 10.527642, lon: 76.214423 },
  "Palakkad": { lat: 10.786660, lon: 76.654778 },
  "Malappuram": { lat: 11.072445, lon: 76.062389 },
  "Kozhikode": { lat: 11.258753, lon: 75.780411 },
  "Wayanad": { lat: 11.685455, lon: 76.132660 },
  "Kannur": { lat: 11.874521, lon: 75.370369 },
  "Kasaragod": { lat: 12.498580, lon: 74.989059 },
};

const keralaDistricts = Object.keys(keralaDistrictCoords);
const alertTypes: AlertType[] = ["weather", "pest", "disease", "price"];

const typeIcon = (type: AlertType) => {
  switch (type) {
    case "weather":
      return <Cloud className="h-5 w-5 text-blue-600" />;
    case "pest":
      return <Bug className="h-5 w-5 text-red-600" />;
    case "disease":
      return <Thermometer className="h-5 w-5 text-orange-600" />;
    case "price":
      return <TrendingUp className="h-5 w-5 text-emerald-600" />;
  }
};

const severityColor = (severity: AlertSeverity) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "low":
      return "bg-blue-100 text-blue-700 border-blue-200";
  }
};

export default function Index() {
  const { profile, alerts, setAlerts } = useFarmerStore();
  const [selectedDistrict, setSelectedDistrict] = useState<string>(profile?.location.district || "Thiruvananthapuram");
  const [selectedType, setSelectedType] = useState<"all" | AlertType>("all");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [crops, setCrops] = useState<CropSuggestionResponse | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  // Mock alerts for now (you can replace this with backend alerts endpoint)
  const mockAlerts: AlertItem[] = useMemo(() => [
    {
      id: "1",
      district: "Thiruvananthapuram",
      state: "Kerala",
      type: "weather",
      severity: "high",
      title: "Heavy Rainfall Alert",
      description:
        "Heavy to very heavy rainfall expected in next 48 hours. Harvest ready crops and ensure drainage.",
      validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      district: "Kozhikode",
      state: "Kerala",
      type: "pest",
      severity: "medium",
      title: "Brown Plant Hopper in Rice",
      description:
        "Increased BPH activity reported in paddy fields. Monitor and apply neem-based sprays timely.",
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      district: "Thrissur",
      state: "Kerala",
      type: "disease",
      severity: "high",
      title: "Blast Disease in Rice",
      description:
        "Blast disease observed in several fields. Apply fungicide and remove infected plants immediately.",
      validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      district: "Ernakulam",
      state: "Kerala",
      type: "price",
      severity: "low",
      title: "Banana Price Surge",
      description:
        "Nendran banana prices increased by ~30% in local markets. Good opportunity for timely harvest.",
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      district: "Palakkad",
      state: "Kerala",
      type: "weather",
      severity: "medium",
      title: "Temperature Dip Alert",
      description:
        "Slight temperature drop expected over next 3 days. Protect sensitive vegetable seedlings.",
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ], []);

  useEffect(() => {
    setAlerts(mockAlerts);
  }, [setAlerts, mockAlerts]);

  // Fetch weather and crop suggestions whenever district changes
  

  useEffect(() => {
  let mounted = true;
  const controller = new AbortController();

  const run = async () => {
    if (selectedDistrict === "all") return; // nothing to fetch for 'all'
    setError(null);
    setLoadingWeather(true);
    setLoadingCrops(true);

    try {
      // Base URL from .env
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

      // If no backend is configured in env, skip network fetches and use local mocks
      if (!baseUrl) {
        // small mocked weather/crops for development
        const mockedWeather: WeatherResponse = {
          fetchedAt: Date.now(),
          current: {
            temperature_2m: 28,
            relative_humidity_2m: 78,
            wind_speed_10m: 8,
            precipitation: 4,
          },
        } as any;
        const mockedCrops: CropSuggestionResponse = {
          method: "local-mock",
          recommendations: [
            { crop: "Rice", reasoning: "Suitable in wet season", score: 85, plantingWindow: "Now - 2 weeks" },
            { crop: "Green Gram", reasoning: "Good short-duration pulse", score: 72 },
          ],
        } as any;
        if (!mounted) return;
        setWeather(mockedWeather);
        setCrops(mockedCrops);
        return;
      }

      // 1) Call backend weather endpoint
      const params = new URLSearchParams({ district: selectedDistrict });
      if (selectedArea.trim()) params.set("area", selectedArea.trim());
      const r = await fetch(`${baseUrl}/weather?${params.toString()}`, { signal: controller.signal });
      if (!r.ok) throw new Error(`Weather API returned ${r.status}`);
      const w = (await r.json()) as WeatherResponse;
      if (!mounted) return;
      setWeather(w);

      // 2) Call crop suggestion endpoint
      const c = await fetch(`${baseUrl}/crop-suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ district: selectedDistrict, coords: keralaDistrictCoords[selectedDistrict], weather: w }),
        signal: controller.signal,
      });
      if (!c.ok) throw new Error(`Crop suggest API returned ${c.status}`);
      const cs = (await c.json()) as CropSuggestionResponse;
      if (!mounted) return;
      setCrops(cs);
    } catch (e: any) {
      if (e.name === "AbortError") return;
      console.error(e);
      setError(e.message || String(e));
    } finally {
      if (mounted) {
        setLoadingWeather(false);
        setLoadingCrops(false);
      }
    }
  };

  run();

  return () => {
    mounted = false;
    controller.abort();
  };
}, [selectedDistrict, selectedArea]);


  const filteredAlerts = useMemo(() => {
    let filtered = alerts.slice();
    if (selectedDistrict !== "all") {
      filtered = filtered.filter((a) => a.district === selectedDistrict);
    }
    if (selectedType !== "all") {
      filtered = filtered.filter((a) => a.type === selectedType);
    }
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) => a.title.toLowerCase().includes(s) || a.description.toLowerCase().includes(s),
      );
    }
    const order: Record<AlertSeverity, number> = { high: 3, medium: 2, low: 1 };
    filtered.sort((a, b) => {
      if (order[a.severity] !== order[b.severity]) return order[b.severity] - order[a.severity];
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return filtered;
  }, [alerts, selectedDistrict, selectedType, searchTerm]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white p-8 shadow-lg bg-[length:200%_200%] animate-gradient-x">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl"></div>
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Agricultural Alerts</h1>
            <p className="mt-2 text-emerald-50/90 max-w-2xl">
              Stay updated with real-time alerts about weather, pests, diseases, and market prices in your region.
            </p>
            {profile && (
              <p className="mt-3 inline-flex items-center gap-2 text-emerald-50/90">
                <MapPin className="h-4 w-4" />
                Showing alerts for {profile.location.district}, {profile.location.state} and nearby areas.
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-white/20 text-white">Kerala</Badge>
            <Badge variant="secondary" className="bg-black/10 text-white">Monsoon Region</Badge>
          </div>
        </div>
      </section>

      <section id="weather" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "60ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cloud className="h-5 w-5 text-blue-600" /> Current Weather</CardTitle>
            <CardDescription>Live conditions for your selected district in Kerala</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">District</label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {keralaDistricts.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Area (optional)</label>
                <Input className="mt-1" placeholder="Village/Locality" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} />
              </div>
            </div>

            <div className="rounded-xl border p-4 bg-muted/30">
              {loadingWeather ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="h-16 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
                  <div className="h-16 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
                  <div className="h-16 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
                  <div className="h-16 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
                </div>
              ) : weather ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Metric label="Temperature" value={weather.current?.temperature_2m != null ? `${weather.current.temperature_2m}°C` : "—"} />
                    <Metric label="Humidity" value={weather.current?.relative_humidity_2m != null ? `${weather.current.relative_humidity_2m}%` : "—"} />
                    <Metric label="Wind" value={weather.current?.wind_speed_10m != null ? `${weather.current.wind_speed_10m} km/h` : "—"} />
                    <Metric label="Precipitation" value={weather.current?.precipitation != null ? `${weather.current.precipitation} mm` : "—"} />
                  </div>

                  {/* extra quick facts: iterate over other fields so you "get every data from API" */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(weather.current || {}).map(([k, v]) => (
                      <div key={k} className="rounded-lg border bg-white p-3">
                        <div className="text-xs text-muted-foreground capitalize">{k.replace(/_/g, " ")}</div>
                        <div className="text-sm mt-1">{String(v)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => setShowRaw((s) => !s)}>
                      <RefreshCw className="h-4 w-4 mr-2" /> Toggle raw API data
                    </Button>
                    <div className="text-xs text-muted-foreground">Last fetched: {new Date(weather.fetchedAt || Date.now()).toLocaleString()}</div>
                  </div>

                  {showRaw && (
                    <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-200">
                      {JSON.stringify({ weather, crops }, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No weather data available.</p>
              )}
              {error && <div className="mt-2 text-sm text-red-600">Error: {error}</div>}
            </div>
          </CardContent>
        </Card>

        <Card id="crops" className="animate-slide-up" style={{ animationDelay: "140ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5 text-emerald-600" /> Suitable Crops Now</CardTitle>
            <CardDescription>AI-assisted recommendations based on current weather</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingCrops && (
              <div className="space-y-3">
                <div className="h-14 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
                <div className="h-14 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
                <div className="h-14 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
              </div>
            )}

            {!loadingCrops && crops && (
              <div className="space-y-3">
                {crops.recommendations.map((c) => (
                  <div key={c.crop} className="flex items-start justify-between gap-4 rounded-lg border p-3">
                    <div>
                      <div className="font-medium">{c.crop}</div>
                      <div className="text-xs text-muted-foreground mt-1">{c.reasoning}</div>
                      {c.plantingWindow && (
                        <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {c.plantingWindow}
                        </div>
                      )}
                    </div>
                    <Badge className="shrink-0 bg-emerald-600 text-white">{c.score}</Badge>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">Method: {crops.method}</p>

                {/* raw crop data for debugging */}
                {showRaw && (
                  <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-200">
                    {JSON.stringify(crops, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {!loadingCrops && !crops && (
              <p className="text-sm text-muted-foreground">No crop suggestions available.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="alerts" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter Alerts</span>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="District" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {keralaDistricts.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Alert Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {alertTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAlerts.length === 0 ? (
          <Alert className="bg-amber-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {searchTerm || selectedDistrict !== "all" || selectedType !== "all"
                ? "Try adjusting your filters to see more alerts."
                : "No active alerts for your area at the moment."}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAlerts.map((a) => (
              <Card key={a.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {typeIcon(a.type)}
                      <CardTitle className="text-base leading-tight">{a.title}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{a.district}, {a.state}</div>
                      <div className="text-[10px] text-muted-foreground">{formatDate(a.createdAt)}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">{a.type}</Badge>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${severityColor(a.severity)}`}>{a.severity}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                  <div className="mt-3 text-xs text-muted-foreground">Valid until: {formatDate(a.validUntil)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
            <CardDescription>For urgent agricultural emergencies or severe weather alerts</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button variant="destructive" className="transition-transform hover:scale-105 active:scale-95">Call Emergency Helpline: 1800-425-1661</Button>
            <Button variant="secondary" className="transition-transform hover:scale-105 active:scale-95">Contact Local Officer</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
