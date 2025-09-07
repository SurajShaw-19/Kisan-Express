import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'farmer' | 'admin';
  adminId?: string;
  phoneNumber: string;
  location: {
    state: string;
    district: string;
    village?: string;
    pincode: string;
  };
  farmSize: number;
  crops: string[];
  farmingExperience: number;
  language: string;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Authentication actions
  login: (phoneNumber: string, password: string, rememberMe?: boolean, role?: 'farmer' | 'admin', adminId?: string) => Promise<boolean>;
  signup: (userData: any, role?: 'farmer' | 'admin') => Promise<boolean>;
  logout: () => void;
  
  // Profile actions
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  
  // Password actions
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  
  // Verification actions
  sendVerificationEmail: () => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  
  // Utility actions
  refreshUser: () => Promise<void>;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,

        // Login function
        login: async (phoneNumber: string, password: string, rememberMe = false, role: 'farmer' | 'admin' = 'farmer', adminId?: string) => {
          set({ isLoading: true });

          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1200));

            // Mock different users based on role
            if (role === 'admin') {
              const adminUser: User = {
                id: Date.now().toString(),
                email: '',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                adminId: adminId || 'ADMIN-' + Math.floor(Math.random() * 9000 + 1000).toString(),
                phoneNumber: phoneNumber || '0000000000',
                location: {
                  state: 'Central',
                  district: 'HeadOffice',
                  village: '',
                  pincode: '000000'
                },
                farmSize: 0,
                crops: [],
                farmingExperience: 0,
                language: 'en',
                isVerified: true,
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString()
              };

              set({ user: adminUser, isAuthenticated: true, isLoading: false });
              toast.success('Admin login successful!');
              return true;
            }

            // Farmer mock
            const mockUser: User = {
              id: Date.now().toString(),
              email: '',
              firstName: 'Rajesh',
              lastName: 'Kumar',
              role: 'farmer',
              phoneNumber: phoneNumber || '9876543210',
              location: {
                state: 'Maharashtra',
                district: 'Pune',
                village: 'Shirur',
                pincode: '412210'
              },
              farmSize: 5.5,
              crops: ['Rice', 'Wheat', 'Cotton'],
              farmingExperience: 15,
              language: 'hi',
              isVerified: true,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            };

            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false
            });

            toast.success('Login successful! Welcome back.');
            return true;
          } catch (error) {
            set({ isLoading: false });
            toast.error('Login failed. Please check your credentials.');
            return false;
          }
        },

        // Signup function
        signup: async (userData: any, role: 'farmer' | 'admin' = 'farmer') => {
          set({ isLoading: true });

          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1600));

            const newUser: User = {
              id: Date.now().toString(),
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: role,
              adminId: userData.adminId || (role === 'admin' ? 'ADMIN-' + Math.floor(Math.random() * 9000 + 1000).toString() : undefined),
              phoneNumber: userData.phoneNumber || '',
              location: userData.location || { state: '', district: '', village: '', pincode: '' },
              farmSize: userData.farmSize || 0,
              crops: userData.crops || [],
              farmingExperience: userData.farmingExperience || 0,
              language: userData.language || 'hi',
              isVerified: role === 'admin' ? true : false,
              createdAt: new Date().toISOString()
            };

            set({
              user: newUser,
              isAuthenticated: true,
              isLoading: false
            });

            toast.success('Account created successfully! Welcome to Kisan Express.');
            return true;
          } catch (error) {
            set({ isLoading: false });
            toast.error('Signup failed. Please try again.');
            return false;
          }
        },

        // Logout function
        logout: () => {
          set({ 
            user: null, 
            isAuthenticated: false 
          });
          toast.success('Logged out successfully.');
        },

        // Update profile function
        updateProfile: async (updates: Partial<User>) => {
          const { user } = get();
          if (!user) return false;

          set({ isLoading: true });
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const updatedUser = { ...user, ...updates };
            set({ 
              user: updatedUser, 
              isLoading: false 
            });

            toast.success('Profile updated successfully.');
            return true;
          } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to update profile.');
            return false;
          }
        },

        // Delete account function
        deleteAccount: async () => {
          set({ isLoading: true });
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });

            toast.success('Account deleted successfully.');
            return true;
          } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to delete account.');
            return false;
          }
        },

        // Forgot password function
        forgotPassword: async (email: string) => {
          set({ isLoading: true });
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set({ isLoading: false });
            toast.success('Password reset email sent! Check your inbox.');
            return true;
          } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to send reset email.');
            return false;
          }
        },

        // Reset password function
        resetPassword: async (token: string, password: string) => {
          set({ isLoading: true });
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set({ isLoading: false });
            toast.success('Password reset successfully! You can now login.');
            return true;
          } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to reset password.');
            return false;
          }
        },

        // Change password function
        changePassword: async (currentPassword: string, newPassword: string) => {
          set({ isLoading: true });
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set({ isLoading: false });
            toast.success('Password changed successfully.');
            return true;
          } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to change password.');
            return false;
          }
        },

        // Send verification email function
        sendVerificationEmail: async () => {
          set({ isLoading: true });
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set({ isLoading: false });
            toast.success('Verification email sent! Check your inbox.');
            return true;
          } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to send verification email.');
            return false;
          }
        },

        // Verify email function
        verifyEmail: async (token: string) => {
          const { user } = get();
          if (!user) return false;

          set({ isLoading: true });
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const verifiedUser = { ...user, isVerified: true };
            set({ 
              user: verifiedUser, 
              isLoading: false 
            });

            toast.success('Email verified successfully!');
            return true;
          } catch (error) {
            set({ isLoading: false });
            toast.error('Failed to verify email.');
            return false;
          }
        },

        // Refresh user function
        refreshUser: async () => {
          const { user } = get();
          if (!user) return;

          try {
            // Simulate API call to refresh user data
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // In a real app, this would fetch fresh user data from the server
            const refreshedUser = { 
              ...user, 
              lastLoginAt: new Date().toISOString() 
            };
            
            set({ user: refreshedUser });
          } catch (error) {
            console.error('Failed to refresh user data:', error);
          }
        },

        // Clear auth state function
        clearAuthState: () => {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);
