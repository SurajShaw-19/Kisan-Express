import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { initMocks } from "./lib/mocks/browser";

// Lazy load all pages for better performance
const Home = lazy(() => import("./pages/Home"));
const OrganicFarming = lazy(() => import("./pages/OrganicFarming"));
const TrainingPrograms = lazy(() => import("./pages/TrainingPrograms"));
const CustomerSupport = lazy(() => import("./pages/CustomerSupport"));
const RootRedirect = lazy(() => import("./pages/RootRedirect"));
const AskQuery = lazy(() => import("./pages/AskQuery"));
const Advisory = lazy(() => import("./pages/Advisory"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Schemes = lazy(() => import("./pages/Schemes"));
const About = lazy(() => import("./pages/About"));
const Community = lazy(() => import("./pages/Community"));
    const ExpertSupport = lazy(() => import("./pages/ExpertSupport"));
    const Login = lazy(() => import("./pages/Login"));
    const Signup = lazy(() => import("./pages/Signup"));
    const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
    const AdminFeedback = lazy(() => import("./pages/AdminFeedback"));
    const UserDetail = lazy(() => import("./pages/UserDetail"));
    const Settings = lazy(() => import("./pages/Settings"));
    const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-forest-500" />
  </div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize MSW in development
        await initMocks();
      } catch (error) {
        console.warn('Failed to initialize mocks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/home" element={<Home />} />
              <Route path="/query" element={<AskQuery />} />
              <Route path="/advisory/:id" element={<Advisory />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/expert-support" element={<ExpertSupport />} />
              <Route path="/organic" element={<OrganicFarming />} />
              <Route path="/training-programs" element={<TrainingPrograms />} />
              <Route path="/customer-support" element={<CustomerSupport />} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/feedback" element={<ProtectedRoute requiredRole="admin"><AdminFeedback /></ProtectedRoute>} />
              <Route path="/users/:id" element={<ProtectedRoute requiredRole="admin"><UserDetail /></ProtectedRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/community" element={<Community />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
