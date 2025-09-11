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
  ChevronRight,
  ChevronLeft,
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
  const user = useAuthStore((s) => s.user);
  const [showMore, setShowMore] = useState(false);

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

  // Ordered features (includes Organic Farming and Training Programs)
  const featuresOrdered = [
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
      icon: Leaf,
      title: "Organic Farming",
      description: "Learn about organic farming practices and resources.",
      href: "/organic",
      color: "bg-amber-100 text-amber-700",
      animation: communityAnimation,
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
      icon: ChevronRight,
      title: "Training Programs",
      description: `See currently happening training programs in ${user?.location?.state || 'your area'}.`,
      href: "/training-programs",
      color: "bg-yellow-100 text-yellow-700",
      animation: null,
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
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-md hover:shadow-xl transition-all hover:scale-105 group">
                  <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
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
      <section className="py-10 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto rounded-2xl border-2 border-emerald-600 bg-white/90 shadow-2xl p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Ask Questions Your Way</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">Use Text, Image, or Voice — whichever is easiest for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              {queryTypes.map((type, index) => (
                <div key={index} className="text-center group rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 md:p-6 hover:bg-emerald-50 transition-colors">
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow">
                    <type.icon className="w-10 h-10 text-emerald-700" />
                  </div>
                  {type.animation ? (
                    <FarmerAnimation className="h-20 mx-auto mb-3" />
                  ) : (
                    <div className="h-20 mx-auto mb-3" />
                  )}
                  <h3 className="text-xl font-semibold mb-1 text-emerald-900">{type.title}</h3>
                  <p className="text-sm md:text-base text-emerald-800/80">{type.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link to="/query">Start Asking Questions<ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (moved below Query Types) */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto rounded-2xl bg-white/90 border border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-foreground">Everything You Need for Modern Farming</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">Access comprehensive agricultural services designed specifically for Indian farmers</p>
            </div>

            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-500" style={{ transform: showMore ? 'translateX(-25%)' : 'translateX(0%)' }}>
                  {featuresOrdered.map((feature, idx) => (
                    <div key={idx} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4 p-2">
                      <Card className="group hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white/80 overflow-hidden rounded-lg h-full">
                        <CardHeader className="text-center pb-3 bg-transparent">
                          <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                            <feature.icon className="w-8 h-8" />
                          </div>
                          <CardTitle className="text-lg mb-2 group-hover:text-slate-700 transition-colors">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center p-4">
                          <CardDescription className="mb-3 text-sm leading-relaxed">{feature.description}</CardDescription>
                          {feature.animation ? (
                            <FarmerAnimation className="h-24 mx-auto mb-3" />
                          ) : (
                            <div className="h-24 mx-auto mb-3" />
                          )}
                          <Button variant="ghost" size="sm" asChild className="group/btn hover:bg-slate-50 transition-all">
                            <Link to={feature.href}>
                              {feature.title === 'Training Programs' || feature.title === 'Organic Farming' ? 'Learn More' : 'Get Started'}
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {isAuthenticated && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <button onClick={() => setShowMore((s) => !s)} aria-label="toggle more features" className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-gray-200 shadow hover:shadow-md transition">
                    {showMore ? <ChevronLeft className="w-5 h-5 text-forest-600" /> : <ChevronRight className="w-5 h-5 text-forest-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Why Choose Kisan Express?</h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Expert Agricultural Advice</h3>
                    <p className="text-muted-foreground">Get answers from certified agricultural experts and AI-powered analysis.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Real-time Monitoring</h3>
                    <p className="text-muted-foreground">Stay updated with weather conditions, market prices, and crop health alerts.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Government Scheme Access</h3>
                    <p className="text-muted-foreground">Discover and apply for subsidies, loans, and agricultural schemes easily.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">24/7 Availability</h3>
                    <p className="text-muted-foreground">Get help anytime, anywhere with our always-available digital platform.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-tr from-emerald-100 to-yellow-50 rounded-xl p-6 text-center border border-emerald-200 shadow-sm">
                {farmerAnimation ? (
                  <FarmerAnimation className="h-28 mx-auto mb-3" />
                ) : (
                  <div className="h-28 mx-auto mb-3" />
                )}
                <div className="w-20 h-20 bg-forest-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Emergency Helpline</h3>
                <p className="text-base font-semibold text-forest-800 mb-1">1800-XXX-XXXX</p>
                <p className="text-muted-foreground">Available 24/7 for urgent agricultural queries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - shrink height after login */}
      <section className={`${isAuthenticated ? 'py-6' : 'py-10 lg:py-12'} bg-gradient-to-r from-slate-600 to-slate-700 text-white`}>
        <div className="container px-4 mx-auto text-center">
          {plantAnimation ? (
            <FarmerAnimation className={`${isAuthenticated ? 'h-16' : 'h-28'} mx-auto mb-4`} />
          ) : (
            <div className={`${isAuthenticated ? 'h-16' : 'h-28'} mx-auto mb-4`} />
          )}
          <h2 className={`${isAuthenticated ? 'text-xl lg:text-2xl' : 'text-2xl lg:text-3xl'} font-bold mb-2 text-white`}>Ready to Transform Your Farming?</h2>
          <p className={`${isAuthenticated ? 'text-base' : 'text-lg'} mb-6 text-white max-w-2xl mx-auto`}>Join thousands of farmers who are already benefiting from AI-powered agricultural advice.</p>
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
