// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

// -------------------- Mock Data --------------------
const mockQueries: any[] = [
  {
    id: "1",
    farmerId: "F001",
    type: "text",
    content:
      "My tomato plants are showing yellow leaves with brown spots. What should I do?",
    category: "disease",
    status: "answered",
    createdAt: "2024-01-15T10:30:00Z",
    answeredAt: "2024-01-15T11:45:00Z",
    officerResponse:
      "This appears to be early blight disease. Apply copper-based fungicide and improve air circulation.",
  },
];

const mockAdvisories: any[] = [
  {
    id: "1",
    queryId: "1",
    response:
      "Based on your description, this appears to be early blight disease in tomatoes. Here are the recommended steps:\n\n1. **Immediate Action**: Apply copper oxychloride fungicide (2g per liter)\n2. **Cultural Practices**: Improve drainage and reduce plant density\n3. **Prevention**: Remove affected leaves and destroy them\n\nMonitor plants daily and repeat treatment if symptoms persist.",
    officerName: "Dr. Priya Sharma",
    officerTitle: "Senior Agricultural Officer",
    confidence: 92,
    sources: [
      "Indian Council of Agricultural Research (ICAR)",
      "State Agricultural University Guidelines",
    ],
    createdAt: "2024-01-15T11:45:00Z",
  },
];

const mockAlerts: any[] = [
  {
    id: "1",
    district: "Pune",
    state: "Maharashtra",
    type: "weather",
    severity: "high",
    title: "Heavy Rainfall Alert",
    description:
      "Heavy to very heavy rainfall expected in next 48 hours. Farmers advised to harvest ready crops.",
    validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    district: "Nashik",
    state: "Maharashtra",
    type: "pest",
    severity: "medium",
    title: "Brown Plant Hopper Outbreak",
    description:
      "Increased BPH activity reported in rice fields. Regular monitoring recommended.",
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockSchemes: any[] = [
  {
    id: "1",
    name: "PM-KISAN Samman Nidhi",
    description:
      "Direct income support to farmers. Rs. 6000 per year in three installments.",
    eligibility: ["Small & marginal farmers", "Landholding up to 2 hectares"],
    benefits: "Rs. 6000 per year (Rs. 2000 every 4 months)",
    howToApply: "Apply online at pmkisan.gov.in",
    deadline: "2024-12-31",
    category: "subsidy",
  },
  {
    id: "2",
    name: "Pradhan Mantri Fasal Bima Yojana",
    description:
      "Crop insurance scheme providing financial support in case of crop loss.",
    eligibility: ["All farmers growing notified crops", "Valid land documents"],
    benefits: "Coverage against crop loss due to natural calamities",
    howToApply: "Apply through banks or insurance companies",
    deadline: "2024-06-30",
    category: "insurance",
  },
];

// -------------------- Handlers --------------------
export const handlers = [
  // Submit Query
  http.post("/api/query", async ({ request }) => {
    const ct = request.headers.get("content-type") || "";
    let payload: any = {};
    if (ct.includes("multipart/form-data")) {
      const fd = await request.formData();
      payload = Object.fromEntries(fd.entries());
      // Normalize types
      if (payload.type == null) payload.type = "text";
      if (payload.category == null) payload.category = "general";
      if (payload.content == null) payload.content = "";
    } else {
      try {
        payload = await request.json();
      } catch {
        payload = {};
      }
    }

    const newQuery = {
      id: Date.now().toString(),
      farmerId: payload.farmerId || "anonymous",
      type: payload.type || "text",
      content: payload.content || "",
      category: payload.category || "general",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    mockQueries.push(newQuery);

    return HttpResponse.json(
      {
        success: true,
        id: newQuery.id,
        data: newQuery,
        message: "Query submitted successfully",
      },
      { status: 201 }
    );
  }),

  // Get Query by ID
  http.get("/api/query/:id", ({ params }) => {
    const { id } = params;
    const query = mockQueries.find((q) => q.id === id);

    if (!query) {
      return HttpResponse.json(
        {
          success: false,
          message: "Query not found",
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({ success: true, data: query });
  }),

  // Get Advisory by Query ID
  http.get("/api/advisory/:queryId", ({ params }) => {
    const { queryId } = params;
    const advisory = mockAdvisories.find((a) => a.queryId === queryId);

    if (!advisory) {
      return HttpResponse.json(
        {
          success: false,
          message: "Advisory not found",
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({ success: true, data: advisory });
  }),

  // Get Alerts
  http.get("/api/alerts", ({ request }) => {
    const url = new URL(request.url);
    const district = url.searchParams.get("district");
    const state = url.searchParams.get("state");
    const type = url.searchParams.get("type");

    let filteredAlerts = [...mockAlerts];

    if (district) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.district.toLowerCase() === district.toLowerCase()
      );
    }

    if (state) {
      filteredAlerts = filteredAlerts.filter(
        (alert) => alert.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (type) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.type === type);
    }

    return HttpResponse.json({
      success: true,
      data: filteredAlerts,
      total: filteredAlerts.length,
    });
  }),

  // Get Schemes
  http.get("/api/schemes", ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    let filteredSchemes = [...mockSchemes];

    if (category) {
      filteredSchemes = filteredSchemes.filter(
        (scheme) => scheme.category === category
      );
    }

    return HttpResponse.json({
      success: true,
      data: filteredSchemes,
      total: filteredSchemes.length,
    });
  }),

  // Submit Feedback
  http.post("/api/feedback", async ({ request }) => {
    const feedbackData = (await request.json()) as Record<string, any>;

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: Date.now().toString(),
          ...feedbackData,
          createdAt: new Date().toISOString(),
        },
        message: "Feedback submitted successfully",
      },
      { status: 201 }
    );
  }),

  // Dashboard - Escalated Queries
  http.get("/api/dashboard/queries", ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");

    const escalatedQueries = [
      {
        id: "1",
        farmerId: "F001",
        farmerName: "Rajesh Kumar",
        location: "Pune, Maharashtra",
        type: "image",
        category: "pest",
        content: "White spots on cotton leaves, plants yellowing",
        status: "escalated",
        priority: "high",
        createdAt: "2024-01-15T10:30:00Z",
        escalatedAt: "2024-01-15T12:15:00Z",
        expectedResponse: "2024-01-15T16:00:00Z",
      },
      {
        id: "2",
        farmerId: "F002",
        farmerName: "Priya Sharma",
        location: "Nashik, Maharashtra",
        type: "text",
        category: "disease",
        content: "Tomato plants showing brown patches on leaves",
        status: "pending",
        priority: "medium",
        createdAt: "2024-01-15T09:45:00Z",
        escalatedAt: "2024-01-15T11:30:00Z",
        expectedResponse: "2024-01-15T15:30:00Z",
      },
    ];

    let filtered = [...escalatedQueries];

    if (status && status !== "all") {
      filtered = filtered.filter((q) => q.status === status);
    }

    if (category && category !== "all") {
      filtered = filtered.filter((q) => q.category === category);
    }

    return HttpResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  }),

  // Dashboard Stats
  http.get("/api/dashboard/stats", () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalQueries: 156,
        escalatedQueries: 23,
        answeredToday: 45,
        avgResponseTime: "2.3 hours",
      },
    });
  }),

  // Health Check
  http.get("/api/health", () => {
    return HttpResponse.json({
      success: true,
      message: "API is healthy",
      timestamp: new Date().toISOString(),
    });
  }),
];