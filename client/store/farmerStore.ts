import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface FarmerProfile {
  id?: string;
  name: string;
  phoneNumber: string;
  location: {
    district: string;
    state: string;
    village?: string;
  };
  crops: string[];
  farmSize: number; // in acres
  language: 'hi' | 'en' | 'bn' | 'te' | 'ta';
}

export interface Query {
  id: string;
  farmerId: string;
  type: 'text' | 'image' | 'voice';
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  category: 'pest' | 'disease' | 'weather' | 'fertilizer' | 'general';
  status: 'pending' | 'answered' | 'escalated';
  createdAt: string;
  answeredAt?: string;
  officerResponse?: string;
}

export interface Alert {
  id: string;
  district: string;
  state: string;
  type: 'weather' | 'pest' | 'disease' | 'price';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  validUntil: string;
  createdAt: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string;
  howToApply: string;
  deadline?: string;
  category: 'subsidy' | 'loan' | 'insurance' | 'training';
}

interface FarmerState {
  // Profile management
  profile: FarmerProfile | null;
  setProfile: (profile: FarmerProfile) => void;
  updateProfile: (updates: Partial<FarmerProfile>) => void;
  clearProfile: () => void;

  // Query management
  queries: Query[];
  addQuery: (query: Omit<Query, 'id' | 'createdAt'>) => void;
  updateQuery: (id: string, updates: Partial<Query>) => void;
  getQueryById: (id: string) => Query | undefined;

  // Alerts
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  getAlertsByLocation: (district: string, state: string) => Alert[];

  // Schemes
  schemes: Scheme[];
  setSchemes: (schemes: Scheme[]) => void;
  getSchemesByCategory: (category: Scheme['category']) => Scheme[];
}

export const useFarmerStore = create<FarmerState>()(
  devtools(
    persist(
      (set, get) => ({
        // Profile state
        profile: null,
        setProfile: (profile) => set({ profile }),
        updateProfile: (updates) =>
          set((state) => ({
            profile: state.profile ? { ...state.profile, ...updates } : null,
          })),
        clearProfile: () => set({ profile: null, queries: [] }),

        // Query state
        queries: [],
        addQuery: (queryData) =>
          set((state) => ({
            queries: [
              ...state.queries,
              {
                ...queryData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
              },
            ],
          })),
        updateQuery: (id, updates) =>
          set((state) => ({
            queries: state.queries.map((query) =>
              query.id === id ? { ...query, ...updates } : query
            ),
          })),
        getQueryById: (id) => get().queries.find((query) => query.id === id),

        // Alert state
        alerts: [],
        setAlerts: (alerts) => set({ alerts }),
        getAlertsByLocation: (district, state) =>
          get().alerts.filter(
            (alert) => alert.district === district && alert.state === state
          ),

        // Scheme state
        schemes: [],
        setSchemes: (schemes) => set({ schemes }),
        getSchemesByCategory: (category) =>
          get().schemes.filter((scheme) => scheme.category === category),
      }),
      {
        name: 'farmer-storage',
        partialize: (state) => ({
          profile: state.profile,
          queries: state.queries,
        }),
      }
    ),
    { name: 'farmer-store' }
  )
);
