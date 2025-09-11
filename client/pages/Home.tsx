import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  AlertTriangle,
  FileText,
  Leaf,
  Users,
  ArrowRight,
  Phone,
  Camera,
  Mic,
  CheckCircle,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FarmerAnimation from "@/components/FarmerAnimation";
import { useAuthStore } from "@/store/authStore";

// Load local Lottie JSON animations if present
let farmerAnimation: any = null;
let plantAnimation: any = null;
let communityAnimation: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  farmerAnimation = require("@/assets/farmer.json");
} catch (e) {}
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plantAnimation = require("@/assets/plant.json");
} catch (e) {}
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  communityAnimation = require("@/assets/community.json");
} catch (e) {}

const Home = () => {
  const [animate, setAnimate] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    try {
      const state = (location as any)?.state;
      if (state && state.animateHero) {
        setAnimate(true);
        const t = setTimeout(() => setAnimate(false), 900);
        try { window.history.replaceState({}, document.title, window.location.pathname); } catch (err) {}
        return () => clearTimeout(t);
      }
    } catch (err) {}
  }, [location]);

  const features = [
    {
      icon: MessageSquare,
      title: "Ask Expert Questions",
      description: "Get instant answers from agricultural experts using text, images, or voice messages.",
      href: "/query",
      color: "bg-green-100 text-green-700",
      animation: farmerAnimation,
    },
    {
      icon: AlertTriangle,
      title: "Weather & Pest Alerts",
      description: "Receive real-time alerts about weather conditions, pest outbreaks, and crop diseases.",
      href: "/alerts",
      color: "bg-emerald-100 text-emerald-700",
      animation: plantAnimation,
    },
    {
      icon: FileText,
      title: "Government Schemes",
      description: "Explore and apply for various government subsidies, loans, and agricultural schemes.",
      href: "/schemes",
      color: "bg-lime-100 text-lime-700",
      animation: communityAnimation,
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow farmers and agricultural officers for knowledge sharing.",
      href: "/about",
      color: "bg-teal-100 text-teal-700",
      animation: farmerAnimation,
    },
  ];

  const queryTypes = [
    {
      icon: MessageSquare,
      title: "Text Queries",
      description: "Type your questions in Hindi or English",
      animation: farmerAnimation,
    },
    {
      icon: Camera,
      title: "Image Analysis",
      description: "Upload photos of crops, pests, or diseases",
      animation: plantAnimation,
    },
    {
      icon: Mic,
      title: "Voice Messages",
      description: "Record voice queries in your local language",
      animation: communityAnimation,
    },
  ];

  const stats = [
    { number: "50,000+", label: "Farmers Helped" },
    { number: "95%", label: "Query Resolution Rate" },
    { number: "24/7", label: "Support Available" },
    { number: "15+", label: "Languages Supported" },
  ];

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-20 bg-cover bg-center" style={{ backgroundImage: "url('https://www.agrifarming.in/wp-content/uploads/Digital-Agriculture-in-India1.jpg')" }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge variant="secondary" className="mb-8 bg-white/80 backdrop-blur-sm text-green-800 hover:bg-white border border-green-200 shadow-lg px-6 py-2 text-base">
              <Leaf className="w-5 h-5 mr-2" />
              AI-Powered Agricultural Advisory
            </Badge>

            <h1 onClick={() => { setAnimate(true); setTimeout(() => setAnimate(false), 900); }} className={`text-5xl lg:text-7xl font-bold mb-8 leading-tight ${animate ? 'animate-hero-pop' : ''}`}>
              <span className="text-foreground">
                Your Digital
              </span>
              <span className="block text-foreground">
                Krishi Officer
              </span>
            </h1>

            <p className="text-2xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Get instant agricultural advice, weather alerts, and government scheme updates. Ask questions in your language through text, images, or voice messages.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" asChild className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-xl hover:shadow-2xl h-14 px-8 text-lg font-semibold transform hover:scale-105 transition-all">
                <Link to="/query">
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Ask Your First Question
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild className="border-2 border-forest-600 text-forest-700 bg-white/90 hover:bg-forest-50 h-14 px-8 text-lg font-semibold hover:border-forest-700 hover:shadow-lg transition-all">
                <Link to="/about">
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                  <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-slate-600/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ask Questions Your Way (moved above Features) */}
      <section className="py-12 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto rounded-2xl border-2 border-emerald-600 bg-white/80 shadow-2xl p-6 md:p-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Ask Questions Your Way</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Use Text, Image, or Voice — whichever is easiest for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
              {queryTypes.map((type, index) => (
                <div key={index} className="text-center group rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 md:p-8 hover:bg-emerald-50 transition-colors">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow">
                    <type.icon className="w-12 h-12 text-emerald-700" />
                  </div>
                  {type.animation ? (
                    <FarmerAnimation className="h-28 mx-auto mb-4" />
                  ) : (
                    <div className="h-28 mx-auto mb-4" />
                  )}
                  <h3 className="text-2xl font-semibold mb-2 text-emerald-900">{type.title}</h3>
                  <p className="text-base md:text-lg text-emerald-800/80">{type.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link to="/query">Start Asking Questions<ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (moved below Query Types) */}
      <section className="py-12 bg-gradient-to-b from-background to-gray-50/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">Everything You Need for Modern Farming</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Access comprehensive agricultural services designed specifically for Indian farmers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden hover:scale-105 hover:-translate-y-2">
                <CardHeader className="text-center pb-4 bg-gradient-to-br from-white to-gray-50/30">
                  <div className={`w-18 h-18 rounded-3xl ${feature.color} flex items-center justify-center mx-auto mb-6`}>
                    <feature.icon className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-xl mb-3 group-hover:text-slate-700 transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center p-6">
                  <CardDescription className="mb-6 text-base leading-relaxed">{feature.description}</CardDescription>
                  {feature.animation ? (
                    <FarmerAnimation className="h-32 mx-auto mb-4" />
                  ) : (
                    <div className="h-32 mx-auto mb-4" />
                  )}
                  <Button variant="ghost" size="sm" asChild className="group/btn hover:bg-slate-50 transition-all">
                    <Link to={feature.href}>
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Why Choose Kisan Express?</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Expert Agricultural Advice</h3>
                    <p className="text-muted-foreground">Get answers from certified agricultural experts and AI-powered analysis.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Real-time Monitoring</h3>
                    <p className="text-muted-foreground">Stay updated with weather conditions, market prices, and crop health alerts.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Government Scheme Access</h3>
                    <p className="text-muted-foreground">Discover and apply for subsidies, loans, and agricultural schemes easily.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">24/7 Availability</h3>
                    <p className="text-muted-foreground">Get help anytime, anywhere with our always-available digital platform.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 text-center">
                {farmerAnimation ? (
                  <FarmerAnimation className="h-40 mx-auto mb-4" />
                ) : (
                  <div className="h-40 mx-auto mb-4" />
                )}
                <div className="w-24 h-24 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Emergency Helpline</h3>
                <p className="text-lg font-semibold text-slate-700 mb-2">1800-XXX-XXXX</p>
                <p className="text-muted-foreground">Available 24/7 for urgent agricultural queries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - shrink height after login */}
      <section className={`${isAuthenticated ? 'py-8' : 'py-12 lg:py-16'} bg-gradient-to-r from-slate-600 to-slate-700 text-white`}>
        <div className="container px-4 mx-auto text-center">
          {plantAnimation ? (
            <FarmerAnimation className={`${isAuthenticated ? 'h-20' : 'h-36'} mx-auto mb-6`} />
          ) : (
            <div className={`${isAuthenticated ? 'h-20' : 'h-36'} mx-auto mb-6`} />
          )}
          <h2 className={`${isAuthenticated ? 'text-2xl lg:text-3xl' : 'text-3xl lg:text-4xl'} font-bold mb-4`}>Ready to Transform Your Farming?</h2>
          <p className={`${isAuthenticated ? 'text-lg' : 'text-xl'} mb-8 text-muted-foreground max-w-2xl mx-auto`}>Join thousands of farmers who are already benefiting from AI-powered agricultural advice.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-white text-slate-700 hover:bg-slate-50">
              <Link to="/query">
                <MessageSquare className="w-5 h-5 mr-2" />
                Ask Your First Question
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2 border-forest-600 text-forest-700 bg-white/90 hover:bg-forest-50 hover:text-forest-700">
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
