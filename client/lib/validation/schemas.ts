import { z } from 'zod';

// Farmer Profile Schema
export const farmerProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  location: z.object({
    district: z.string().min(1, 'District is required'),
    state: z.string().min(1, 'State is required'),
    village: z.string().optional(),
  }),
  crops: z.array(z.string()).min(1, 'At least one crop must be selected'),
  farmSize: z.number().min(0.1, 'Farm size must be at least 0.1 acres'),
  language: z.enum(['hi', 'en', 'bn', 'te', 'ta']),
});

// Query Schema
export const querySchema = z.object({
  type: z.enum(['text', 'image', 'voice']),
  content: z.string().min(10, 'Query must be at least 10 characters'),
  category: z.enum(['pest', 'disease', 'weather', 'fertilizer', 'general']),
  imageUrl: z.string().url().optional(),
  audioUrl: z.string().url().optional(),
});

// Feedback Schema
export const feedbackSchema = z.object({
  queryId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  helpful: z.boolean(),
});

// Contact Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

// Login Schema (for officer dashboard)
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length === 1, 'Please select a file')
    .refine(
      (files) => files?.[0]?.size <= 5000000,
      'File size should be less than 5MB'
    )
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      'Only JPEG, PNG and WebP files are allowed'
    ),
});

// Search Schema
export const searchSchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters'),
  category: z.enum(['all', 'pest', 'disease', 'weather', 'fertilizer', 'general']).optional(),
  location: z.string().optional(),
});

export type FarmerProfile = z.infer<typeof farmerProfileSchema>;
export type Query = z.infer<typeof querySchema>;
export type Feedback = z.infer<typeof feedbackSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Login = z.infer<typeof loginSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type Search = z.infer<typeof searchSchema>;
