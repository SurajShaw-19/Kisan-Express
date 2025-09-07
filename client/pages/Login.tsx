import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  LogIn, 
  Mail, 
  Lock, 
  Sprout, 
  Eye, 
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validation/auth";
import { useAuthStore } from "@/store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
  const [adminIdInput, setAdminIdInput] = useState('');

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    // If already authenticated, redirect appropriately
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);

    try {
      const success = await login(data.phoneNumber, data.password, data.rememberMe, role, role === 'admin' ? adminIdInput : undefined);

      if (success) {
        const redirectTo = location.state?.from?.pathname;
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        } else if (role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setLoginError('Invalid mobile number or password. Please try again.');
      }
    } catch (error) {
      setLoginError('Something went wrong. Please try again.');
    }
  };

  const watchedPhone = watch('phoneNumber');
  const watchedPassword = watch('password');
  const watchedRememberMe = watch('rememberMe');

  return (
    <div className="min-h-screen page-bg-login flex items-center justify-center p-4 animate-page-fade">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-100/6 via-transparent to-wheat-100/6 animate-floaty" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-forest-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Login Card */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-md animate-pop-in card-tilt">
          <CardHeader className="bg-gradient-to-r from-forest-50 to-wheat-50 border-b text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-forest-500 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-forest-700 to-forest-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in to your Kisan Express account
            </CardDescription>

            {/* Role selector */}
            <div className="mt-4 flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${role === 'farmer' ? 'bg-forest-600 text-white' : 'bg-white/60 text-forest-700 border border-forest-100'}`}
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${role === 'admin' ? 'bg-amber-600 text-white' : 'bg-white/60 text-forest-700 border border-forest-100'}`}
              >
                Admin
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Login Error */}
            {loginError && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 font-medium">
                  {loginError}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message from Signup */}
            {location.state?.message && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700 font-medium">
                  {location.state.message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 stagger-container">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-base font-semibold">
                  Mobile Number
                </Label>
                <div className="relative input-glow">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    placeholder="Enter your 10-digit mobile number"
                    className="pl-10 h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                    {...register('phoneNumber')}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600 font-medium">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Password Field */}
              {role === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="adminId" className="text-base font-semibold">
                    Admin ID
                  </Label>
                  <div className="relative">
                    <Input
                      id="adminId"
                      type="text"
                      placeholder="Enter your Admin ID"
                      value={adminIdInput}
                      onChange={(e) => setAdminIdInput(e.target.value)}
                      className="h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold">
                  Password
                </Label>
                <div className="relative input-glow">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-forest-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={watchedRememberMe}
                    onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-medium cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-forest-600 hover:text-forest-700 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !watchedPhone || !watchedPassword}
                className="w-full h-12 bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all btn-shimmer"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-3" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8">
              <Separator className="relative">
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-muted-foreground">
                  New to Kisan Express?
                </span>
              </Separator>
            </div>

            {/* Signup Link (visible to farmers only) */}
            {role === 'farmer' && (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Join thousands of farmers getting expert agricultural advice
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full h-12 border-2 border-forest-300 text-forest-700 hover:bg-forest-50 hover:border-forest-500 font-semibold transition-all"
                >
                  <Link to="/signup">
                    Create New Account
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Need help? Contact our support team at{' '}
            <a href="mailto:support@krishiofficer.gov.in" className="text-forest-600 hover:underline">
              support@krishiofficer.gov.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
