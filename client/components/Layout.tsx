import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  Sprout,
  MessageSquare,
  AlertTriangle,
  FileText,
  Users,
  BarChart3,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Settings,
  Bell,
  Globe,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useFarmerStore } from "@/store/farmerStore";
import { useAuthStore } from "@/store/authStore";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  // language selection state (persisted in localStorage)
  const [lang, setLang] = useState<string>(() => {
    try {
      return localStorage.getItem("kisan_lang") || "en";
    } catch (e) {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("kisan_lang", lang);
      document.documentElement.lang = lang;
    } catch (e) {}
  }, [lang]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navigation = [
    { name: "Home", href: "/home", icon: Sprout, allowedRole: "all" },
    {
      name: "Ask Query",
      href: "/query",
      icon: MessageSquare,
      allowedRole: "farmer",
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: AlertTriangle,
      allowedRole: "farmer",
    },
    {
      name: "Expert Support",
      href: "/expert-support",
      icon: Users,
      allowedRole: "all",
    },
    { name: "Schemes", href: "/schemes", icon: FileText, allowedRole: "all" },
    { name: "About", href: "/about", icon: Users, allowedRole: "all" },
  ];

  // Determine which navigation items are visible based on current user role
  const visibleNavigation = navigation.filter((item) => {
    // If no authenticated user, show all links (they will be prompted to login on click)
    if (!user) return true;
    if (user.role === "admin") {
      // admins should not see farmer-only features
      return item.allowedRole !== "farmer";
    }
    if (user.role === "farmer") {
      // farmers should not see admin-only features
      return item.allowedRole !== "admin";
    }
    return true;
  });

  // Per-page background styles
  const pageBackgrounds: Record<string, string> = {
    "/home":
      "grid-bg-green bg-grid-hero bg-gradient-to-br from-emerald-50 via-emerald-100 to-amber-50",
    "/query": "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    "/alerts": "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    "/schemes": "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    "/about": "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    "/dashboard": "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    "/login": "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    "/signup": "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    "/profile": "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    "/admin": "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900",
  };

  // choose closest match; exact match first, then startsWith
  const pathname = location.pathname;
  let pageBg = pageBackgrounds[pathname] || "bg-background";
  if (!pageBackgrounds[pathname]) {
    // try simple startsWith checks for dynamic routes
    if (pathname.startsWith("/advisory"))
      pageBg = "bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-200";
    else if (pathname.startsWith("/alerts"))
      pageBg = pageBackgrounds["/alerts"];
    else if (pathname.startsWith("/schemes"))
      pageBg = pageBackgrounds["/schemes"];
    else if (pathname.startsWith("/admin")) pageBg = pageBackgrounds["/admin"];
  }

  // Footer style override for admin pages
  const footerClass = pathname.startsWith("/admin")
    ? "border-t bg-slate-900 text-white animate-slide-up"
    : "border-t bg-muted/50 animate-slide-up";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-700 ${pageBg} animate-page-fade`}
    >
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 font-medium"
      >
        Skip to main content
      </a>

      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-gradient-to-r from-emerald-50 via-emerald-100 to-amber-50 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm animate-slide-down">
        <div className="container flex h-18 items-center justify-between py-2">
          {/* Enhanced Logo */}
          <Link
            to="/home"
            state={{ animateHero: true }}
            className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-3 group"
          >
            <div className="rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 p-3 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105 logo-pulse">
              <Sprout className="h-7 w-7 text-white" />
            </div>
            <div className="mt-2 sm:mt-0 text-center sm:text-left">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-forest-700 to-emerald-600 bg-clip-text text-transparent block">
                Kisan Express
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                AI-Powered Agricultural Advisory
              </p>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 ml-6">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              const requiresAuth = item.href !== "/";
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  state={
                    item.href === "/home" ? { animateHero: true } : undefined
                  }
                  onClick={(e) => {
                    // If not authenticated, prompt login
                    if (!isAuthenticated && requiresAuth) {
                      e.preventDefault();
                      navigate("/login", {
                        state: { from: { pathname: item.href } },
                      });
                      return;
                    }

                    // If authenticated but role mismatch, redirect to user's dashboard
                    if (isAuthenticated && user) {
                      if (
                        item.allowedRole === "farmer" &&
                        user.role !== "farmer"
                      ) {
                        e.preventDefault();
                        navigate("/admin", { replace: true });
                        return;
                      }
                      if (
                        item.allowedRole === "admin" &&
                        user.role !== "admin"
                      ) {
                        e.preventDefault();
                        navigate("/", { replace: true });
                        return;
                      }
                    }
                  }}
                  aria-label={item.name}
                  className={`group flex items-center justify-center px-2 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-forest-600 to-emerald-600 text-white shadow-lg border border-forest-700"
                      : "text-forest-700 hover:text-white hover:bg-gradient-to-r hover:from-forest-500 hover:to-wheat-50"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg nav-icon-hover ${isActive ? "bg-gradient-to-br from-forest-700 to-emerald-600 text-white" : "bg-gradient-to-br from-white/60 to-forest-50 text-forest-700"} transition-all`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-white" : "text-forest-700 group-hover:text-white"}`}
                    />
                  </div>

                  {/* label appears on hover */}
                  <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[160px] group-hover:ml-3 group-hover:opacity-100 transition-all duration-200 text-sm font-medium link-underline-anim">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Enhanced User Profile & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                  aria-label="Select language"
                >
                  <Globe className="w-4 h-4 text-forest-700" />
                  <span className="text-sm text-forest-700">
                    {lang === "en" ? "EN" : "മ"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLang("en")}>
                  English{" "}
                  {lang === "en" ? (
                    <span className="ml-2 text-forest-600">✓</span>
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("ml")}>
                  മലയാളം{" "}
                  {lang === "ml" ? (
                    <span className="ml-2 text-forest-600">✓</span>
                  ) : null}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-forest-50 to-wheat-50 px-4 py-2 rounded-xl border border-forest-100 h-auto hover:bg-gradient-to-r hover:from-forest-100 hover:to-wheat-100 transition-all card-tilt"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-forest-500 to-forest-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-medium text-forest-700 block">
                        Welcome, {user.firstName}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {user.location.district}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-forest-500 to-forest-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user.firstName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings#account" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings#notifications"
                      className="cursor-pointer"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings#language" className="cursor-pointer">
                      <Globe className="w-4 h-4 mr-2" />
                      Language
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/customer-support" className="cursor-pointer">
                      <Phone className="w-4 h-4 mr-2" />
                      Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      navigate("/login", { replace: true });
                    }}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-forest-700 hover:bg-forest-50"
                >
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-forest-600 to-emerald-600 hover:from-forest-700 hover:to-forest-800 text-white"
                >
                  <Link to="/signup">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {/* Enhanced Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-10 w-10 rounded-xl hover:bg-forest-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-forest-600" />
              ) : (
                <Menu className="h-5 w-5 text-forest-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-gradient-to-br from-white to-forest-50/30 backdrop-blur-sm">
            <nav className="container py-6 space-y-3">
              {/* User Profile Section for Mobile */}
              {isAuthenticated && user && (
                <div className="bg-gradient-to-r from-white to-forest-50 rounded-xl p-4 mb-4 border border-forest-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-forest-500 to-forest-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-forest-700">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.location.district}, {user.location.state}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-forest-300 text-forest-700 hover:bg-forest-50"
                    >
                      <Link to="/profile">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        logout();
                        navigate("/login", { replace: true });
                      }}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              {visibleNavigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                const requiresAuth = item.href !== "/";
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => {
                      // not authenticated -> prompt login
                      if (!isAuthenticated && requiresAuth) {
                        e.preventDefault();
                        navigate("/login", {
                          state: { from: { pathname: item.href } },
                        });
                        return;
                      }

                      // authenticated but role mismatch -> redirect to appropriate dashboard
                      if (isAuthenticated && user) {
                        if (
                          item.allowedRole === "farmer" &&
                          user.role !== "farmer"
                        ) {
                          e.preventDefault();
                          navigate("/admin", { replace: true });
                          return;
                        }
                        if (
                          item.allowedRole === "admin" &&
                          user.role !== "admin"
                        ) {
                          e.preventDefault();
                          navigate("/", { replace: true });
                          return;
                        }
                      }
                    }}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 animate-in slide-in-from-left ${
                      isActive
                        ? "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 shadow-sm border border-slate-200"
                        : "text-muted-foreground hover:text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white hover:shadow-sm"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center nav-icon-hover ${
                        isActive ? "bg-forest-500" : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-600"}`}
                      />
                    </div>
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-forest-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}

              {/* Login/Signup for Mobile */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-forest-200 space-y-3">
                  <Link
                    to="/login"
                    className="flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-forest-700 hover:bg-gradient-to-r hover:from-forest-50 hover:to-wheat-50 hover:shadow-sm transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <LogIn className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-sm transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <UserPlus className="h-4 w-4 text-white" />
                    </div>
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      {isAuthenticated ? (
        <section id="main-content" className="flex-1 relative" role="main">
          {pathname.startsWith("/admin") && (
            <div
              className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-amber-50/40 to-slate-800/5 backdrop-blur-sm pointer-events-none"
              aria-hidden
            />
          )}
          <div className="relative z-10 animate-content-fade">{children}</div>
        </section>
      ) : (
        <main id="main-content" className="flex-1 relative" role="main">
          {pathname.startsWith("/admin") && (
            <div
              className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-amber-50/40 to-slate-800/5 backdrop-blur-sm pointer-events-none"
              aria-hidden
            />
          )}
          <div className="relative z-10 animate-content-fade">{children}</div>
        </main>
      )}

      {/* Footer */}
      <footer className={footerClass}>
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="rounded-lg bg-forest-500 p-2 logo-pulse">
                  <Sprout className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-forest-700">
                  Kisan Express
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                AI-powered agricultural advisory system helping farmers with
                real-time solutions, government schemes, and expert guidance for
                better crop management.
              </p>

              {/* Trust badges */}
              <div className="flex items-center gap-3 mt-4">
                <div className="px-3 py-2 bg-white/80 rounded-lg shadow-sm border">
                  Govt. Approved
                </div>
                <div className="px-3 py-2 bg-white/80 rounded-lg shadow-sm border">
                  Secure
                </div>
                <div className="px-3 py-2 bg-white/80 rounded-lg shadow-sm border">
                  Trusted by Farmers
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/query"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Ask a Question
                  </Link>
                </li>
                <li>
                  <Link
                    to="/alerts"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Weather Alerts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/schemes"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Government Schemes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Helpline: 1800-XXX-XXXX</li>
                <li>Email: support@krishiofficer.gov.in</li>
                <li>Mon-Fri: 9:00 AM - 6:00 PM</li>
                <li>Sat: 9:00 AM - 2:00 PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Kisan Express. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
