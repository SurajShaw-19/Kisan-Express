import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Sprout, 
  Eye, 
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import { signupSchema, type SignupFormData, indianStates, commonCrops, languages } from "@/lib/validation/auth";
import { useAuthStore } from "@/store/authStore";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');

  // total steps depend on role (admins need fewer steps)
  const totalSteps = role === 'admin' ? 2 : 4;
  const progress = (currentStep / totalSteps) * 100;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    getValues
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      role: 'farmer',
      adminId: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      location: {
        state: '',
        district: '',
        village: '',
        pincode: ''
      },
      farmSize: 1,
      crops: [],
      farmingExperience: 1,
      language: 'hi',
      acceptTerms: false,
      subscribeNewsletter: false
    }
  });

  const watchedData = watch();

  // whenever role changes, sync it into the form and reset steps
  useEffect(() => {
    setValue('role', role as any);
    setCurrentStep(1);
    // clear selected crops when switching to admin
    if (role === 'admin') {
      setSelectedCrops([]);
      setValue('crops', []);
    }
  }, [role, setValue]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      const success = await signup(data, role);

    if (success) {
      // After successful signup, the store already sets the user as authenticated.
      if (role === 'admin') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof SignupFormData)[] => {
    // For admin, only first two steps (personal + account) are needed, but adminId is required
    if (role === 'admin') {
      switch (step) {
        case 1:
          return ['firstName', 'lastName', 'email', 'phoneNumber', 'adminId'];
        case 2:
          return ['password', 'confirmPassword'];
        default:
          return [];
      }
    }

    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phoneNumber'];
      case 2:
        return ['password', 'confirmPassword'];
      case 3:
        return ['location', 'farmSize', 'farmingExperience'];
      case 4:
        return ['crops', 'language', 'acceptTerms'];
      default:
        return [];
    }
  };

  const handleCropToggle = (crop: string) => {
    const updatedCrops = selectedCrops.includes(crop)
      ? selectedCrops.filter(c => c !== crop)
      : [...selectedCrops, crop];
    
    setSelectedCrops(updatedCrops);
    setValue('crops', updatedCrops);
  };

  const isStepValid = (step: number) => {
    const fields = getFieldsForStep(step);
    return fields.every(field => {
      if (field === 'location') {
        return watchedData.location?.state && watchedData.location?.district && watchedData.location?.pincode;
      }
      if (field === 'crops') {
        return selectedCrops.length > 0;
      }
      return watchedData[field];
    });
  };

  const stepTitles = [
    "Personal Information",
    "Account Security",
    "Location & Farm Details",
    "Preferences & Terms"
  ];

  const stepDescriptions = [
    "Tell us about yourself",
    "Create a secure password",
    "Where is your farm located?",
    "Customize your experience"
  ];

  return (
    <div className="min-h-screen page-bg-signup flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-100/6 via-transparent to-wheat-100/6"></div>

      <div className="w-full max-w-2xl relative z-10">
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

        {/* Signup Card */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-forest-50 to-wheat-50 border-b text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-forest-500 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-forest-700 to-forest-600 bg-clip-text text-transparent">
              Join Kisan Express
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {stepDescriptions[currentStep - 1]}
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

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-forest-700 mb-2">
                      {stepTitles[0]}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-base font-semibold">
                        First Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          className="pl-10 h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                          {...register('firstName')}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-sm text-red-600 font-medium">{errors.firstName.message}</p>
                      )}
                    </div>

                    {/* Admin ID (only for admin role) */}
                    {role === 'admin' && (
                      <div className="space-y-2">
                        <Label htmlFor="adminId" className="text-base font-semibold">
                          Personal ID for Admin *
                        </Label>
                        <div className="relative">
                          <Input
                            id="adminId"
                            placeholder="Enter your Admin Personal ID"
                            className="h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                            {...register('adminId')}
                          />
                        </div>
                        {errors.adminId && (
                          <p className="text-sm text-red-600 font-medium">{(errors as any).adminId?.message}</p>
                        )}
                      </div>
                    )}

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-base font-semibold">
                        Last Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="lastName"
                          placeholder="Enter last name"
                          className="pl-10 h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                          {...register('lastName')}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-sm text-red-600 font-medium">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-semibold">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-base font-semibold">
                      Mobile Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phoneNumber"
                        placeholder="10-digit mobile number"
                        className="pl-10 h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                        {...register('phoneNumber')}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-600 font-medium">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Account Security */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-forest-700 mb-2">
                      {stepTitles[1]}
                    </h3>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-semibold">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-forest-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-base font-semibold">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                        {...register('confirmPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-forest-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      Password must contain at least 8 characters with uppercase, lowercase, and numbers.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 3: Location & Farm Details (farmer only) */}
              {role === 'farmer' && currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-forest-700 mb-2">
                      {stepTitles[2]}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* State */}
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-base font-semibold">
                        State *
                      </Label>
                      <Select onValueChange={(value) => setValue('location.state', value)}>
                        <SelectTrigger className="h-12 border-2 hover:border-forest-300 transition-colors">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.location?.state && (
                        <p className="text-sm text-red-600 font-medium">{errors.location.state.message}</p>
                      )}
                    </div>

                    {/* District */}
                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-base font-semibold">
                        District *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="district"
                          placeholder="Enter district"
                          className="pl-10 h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                          {...register('location.district')}
                        />
                      </div>
                      {errors.location?.district && (
                        <p className="text-sm text-red-600 font-medium">{errors.location.district.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Village */}
                    <div className="space-y-2">
                      <Label htmlFor="village" className="text-base font-semibold">
                        Village (Optional)
                      </Label>
                      <Input
                        id="village"
                        placeholder="Enter village"
                        className="h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                        {...register('location.village')}
                      />
                    </div>

                    {/* Pincode */}
                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="text-base font-semibold">
                        Pincode *
                      </Label>
                      <Input
                        id="pincode"
                        placeholder="6-digit pincode"
                        className="h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                        {...register('location.pincode')}
                      />
                      {errors.location?.pincode && (
                        <p className="text-sm text-red-600 font-medium">{errors.location.pincode.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Farm Size */}
                    <div className="space-y-2">
                      <Label htmlFor="farmSize" className="text-base font-semibold">
                        Farm Size (in acres) *
                      </Label>
                      <Input
                        id="farmSize"
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="e.g., 5.5"
                        className="h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                        {...register('farmSize', { valueAsNumber: true })}
                      />
                      {errors.farmSize && (
                        <p className="text-sm text-red-600 font-medium">{errors.farmSize.message}</p>
                      )}
                    </div>

                    {/* Farming Experience */}
                    <div className="space-y-2">
                      <Label htmlFor="farmingExperience" className="text-base font-semibold">
                        Farming Experience (years) *
                      </Label>
                      <Input
                        id="farmingExperience"
                        type="number"
                        min="0"
                        placeholder="e.g., 10"
                        className="h-12 border-2 hover:border-forest-300 focus:border-forest-500 transition-colors"
                        {...register('farmingExperience', { valueAsNumber: true })}
                      />
                      {errors.farmingExperience && (
                        <p className="text-sm text-red-600 font-medium">{errors.farmingExperience.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Preferences & Terms (farmer only) */}
              {role === 'farmer' && currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-forest-700 mb-2">
                      {stepTitles[3]}
                    </h3>
                  </div>

                  {/* Crops */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">
                      Crops You Grow *
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select all crops that you currently grow
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                      {commonCrops.map((crop) => (
                        <div key={crop} className="flex items-center space-x-2">
                          <Checkbox
                            id={crop}
                            checked={selectedCrops.includes(crop)}
                            onCheckedChange={() => handleCropToggle(crop)}
                          />
                          <Label htmlFor={crop} className="text-sm cursor-pointer">
                            {crop}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {selectedCrops.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedCrops.map((crop) => (
                          <Badge key={crop} variant="secondary" className="bg-forest-100 text-forest-700">
                            {crop}
                            <button
                              type="button"
                              onClick={() => handleCropToggle(crop)}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    {errors.crops && (
                      <p className="text-sm text-red-600 font-medium">{errors.crops.message}</p>
                    )}
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-base font-semibold">
                      Preferred Language *
                    </Label>
                    <Select onValueChange={(value) => setValue('language', value as any)}>
                      <SelectTrigger className="h-12 border-2 hover:border-forest-300 transition-colors">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.language && (
                      <p className="text-sm text-red-600 font-medium">{errors.language.message}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={watchedData.acceptTerms}
                        onCheckedChange={(checked) => setValue('acceptTerms', !!checked)}
                      />
                      <Label htmlFor="acceptTerms" className="text-sm cursor-pointer leading-relaxed">
                        I agree to the{' '}
                        <Link to="/terms" className="text-forest-600 hover:underline">
                          Terms and Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-forest-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-600 font-medium">{errors.acceptTerms.message}</p>
                    )}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="subscribeNewsletter"
                        checked={watchedData.subscribeNewsletter}
                        onCheckedChange={(checked) => setValue('subscribeNewsletter', !!checked)}
                      />
                      <Label htmlFor="subscribeNewsletter" className="text-sm cursor-pointer leading-relaxed">
                        Subscribe to our newsletter for farming tips and updates
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="border-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className={`ml-auto bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 ${
                      !isStepValid(currentStep) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !isStepValid(currentStep)}
                    className="ml-auto bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-3" />
                        Create Account
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8 pt-6 border-t">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-forest-600 hover:text-forest-700 font-medium hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
