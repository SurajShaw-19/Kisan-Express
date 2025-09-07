import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  rememberMe: z.boolean().optional().default(false),
});

// Signup Schema (supports both farmer and admin roles)
export const signupSchema = z.object({
  // Role and admin id
  role: z.enum(['farmer', 'admin']).default('farmer'),
  adminId: z.string().optional(),

  // Personal Information
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),

  // Location Information (optional; required for farmers)
  location: z.object({
    state: z.string().optional(),
    district: z.string().optional(),
    village: z.string().optional(),
    pincode: z
      .string()
      .optional(),
  }).optional(),

  // Farming Information (optional; required for farmers)
  farmSize: z
    .number()
    .optional(),
  crops: z
    .array(z.string())
    .optional(),
  farmingExperience: z
    .number()
    .optional(),

  // Preferences
  language: z.enum(['hi', 'en', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'or']).optional(),

  // Terms and Privacy
  acceptTerms: z.boolean().optional(),
  subscribeNewsletter: z.boolean().optional().default(false),
}).superRefine((data, ctx) => {
  // Password confirm
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Passwords don't match", path: ['confirmPassword'] });
  }

  if (data.role === 'farmer') {
    // enforce farmer required fields
    if (!data.location || !data.location.state) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'State is required for farmers', path: ['location', 'state'] });
    }
    if (!data.location || !data.location.district) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'District is required for farmers', path: ['location', 'district'] });
    }
    if (!data.location || !data.location.pincode || !/^\d{6}$/.test(data.location.pincode)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter a valid 6-digit pincode', path: ['location', 'pincode'] });
    }
    if (typeof data.farmSize !== 'number' || isNaN(data.farmSize)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Farm size is required for farmers', path: ['farmSize'] });
    }
    if (!data.crops || data.crops.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please select at least one crop', path: ['crops'] });
    }
    if (typeof data.farmingExperience !== 'number' || isNaN(data.farmingExperience)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Farming experience is required', path: ['farmingExperience'] });
    }
    if (data.acceptTerms !== true) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'You must accept the terms and conditions', path: ['acceptTerms'] });
    }
  }

  if (data.role === 'admin') {
    if (!data.adminId || data.adminId.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Admin Personal ID is required', path: ['adminId'] });
    }
  }
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Profile Update Schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  location: z.object({
    state: z.string().min(1, 'State is required'),
    district: z.string().min(1, 'District is required'),
    village: z.string().optional(),
    pincode: z
      .string()
      .regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode'),
  }),
  farmSize: z
    .number()
    .min(0.1, 'Farm size must be at least 0.1 acres')
    .max(10000, 'Farm size must be less than 10,000 acres'),
  crops: z
    .array(z.string())
    .min(1, 'Please select at least one crop'),
  farmingExperience: z
    .number()
    .min(0, 'Experience cannot be negative')
    .max(100, 'Experience must be less than 100 years'),
  language: z.enum(['hi', 'en', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'or']),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// Common data for forms
export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const commonCrops = [
  'Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Corn (Maize)', 'Soybean',
  'Groundnut', 'Sunflower', 'Mustard', 'Barley', 'Bajra (Pearl Millet)',
  'Jowar (Sorghum)', 'Pulses (Dal)', 'Onion', 'Potato', 'Tomato',
  'Chili', 'Turmeric', 'Coconut', 'Tea', 'Coffee', 'Rubber'
];

export const languages = [
  { value: 'hi', label: 'Hindi (हिंदी)' },
  { value: 'en', label: 'English' },
  { value: 'bn', label: 'Bengali (বাংলা)' },
  { value: 'te', label: 'Telugu (తెలుగు)' },
  { value: 'ta', label: 'Tamil (த��ிழ்)' },
  { value: 'mr', label: 'Marathi (मराठी)' },
  { value: 'gu', label: 'Gujarati (ગુજરાતી)' },
  { value: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
  { value: 'ml', label: 'Malayalam (മലയാളം)' },
  { value: 'or', label: 'Odia (ଓଡ଼ିଆ)' },
];
