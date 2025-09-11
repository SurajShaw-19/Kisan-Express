import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from './authStore';

export interface AdminNotification {
  id: string;
  userId?: string;
  message: string;
  read?: boolean;
  createdAt: string;
}

export interface CustomerFeedback {
  id: string;
  userId?: string;
  queryId?: string;
  queryCategory?: string;
  queryText: string;
  responseText?: string;
  rating?: number; // 1-5
  createdAt: string;
}

interface AdminState {
  users: User[];
  notifications: AdminNotification[];
  feedback: CustomerFeedback[];
  isLoading: boolean;

  // user actions
  fetchUsers: () => Promise<User[]>;
  getUserById: (id: string) => User | undefined;
  deleteUser: (id: string) => Promise<boolean>;
  searchUsers: (query: string) => User[];

  // feedback
  fetchFeedback: () => CustomerFeedback[];
  addFeedback: (fb: Omit<CustomerFeedback, 'id' | 'createdAt'>) => void;
  deleteFeedback: (id: string) => void;

  // notifications
  fetchNotifications: () => AdminNotification[];
  markNotificationRead: (id: string) => void;
  addNotification: (note: Omit<AdminNotification, 'id' | 'createdAt'>) => void;
}

// Helper to create mock users
const makeMockUser = (i: number): User => {
  const isAdmin = i % 8 === 0; // a couple admins
  return {
    id: `${1000 + i}`,
    email: isAdmin ? `admin${i}@example.com` : `farmer${i}@example.com`,
    firstName: isAdmin ? `Admin${i}` : `Farmer${i}`,
    lastName: isAdmin ? `Manager` : `Kumar`,
    role: isAdmin ? 'admin' : 'farmer',
    adminId: isAdmin ? `ADMIN-${1000 + i}` : undefined,
    phoneNumber: `9${Math.floor(100000000 + Math.random() * 899999999)}`,
    location: {
      state: ['Maharashtra', 'Punjab', 'Bihar', 'Tamil Nadu'][i % 4],
      district: `District ${i % 10}`,
      village: `Village ${i}`,
      pincode: `${400000 + (i % 900)}`,
    },
    farmSize: isAdmin ? 0 : Math.round((Math.random() * 10 + 0.5) * 10) / 10,
    crops: isAdmin ? [] : ['Rice', 'Wheat'].slice(0, (i % 2) + 1),
    farmingExperience: isAdmin ? 0 : (i % 30) + 1,
    language: i % 2 === 0 ? 'hi' : 'en',
    profilePicture: undefined,
    isVerified: i % 3 === 0,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
  } as User;
};

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => ({
        users: Array.from({ length: 12 }).map((_, i) => makeMockUser(i + 1)),
        notifications: [
          {
            id: 'n1',
            userId: '1001',
            message: 'New signup: Farmer2',
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'n2',
            message: 'System maintenance scheduled tomorrow',
            read: false,
            createdAt: new Date().toISOString(),
          },
        ],

        // mock customer feedback entries
        feedback: [
          {
            id: 'f1',
            userId: '1002',
            queryId: 'q100',
            queryCategory: 'pest',
            queryText: 'Leaves have brown spots, what to do?',
            responseText: 'It looks like a fungal issue. Apply recommended fungicide and improve drainage.',
            rating: 4,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'f2',
            userId: '1005',
            queryId: 'q101',
            queryCategory: 'weather',
            queryText: 'Any upcoming heavy rains?',
            responseText: 'Yes, rain expected next week; take precautions.',
            rating: 5,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          },
        ],

        isLoading: false,

        fetchUsers: async () => {
          set({ isLoading: true });
          // Simulate API delay
          await new Promise((r) => setTimeout(r, 600));
          const users = get().users;
          set({ isLoading: false });
          return users;
        },

        getUserById: (id: string) => {
          return get().users.find((u) => u.id === id);
        },

        deleteUser: async (id: string) => {
          set({ isLoading: true });
          await new Promise((r) => setTimeout(r, 600));
          const exists = get().users.some((u) => u.id === id);
          if (!exists) {
            set({ isLoading: false });
            return false;
          }
          set((state) => ({ users: state.users.filter((u) => u.id !== id), isLoading: false }));
          // add notification
          get().addNotification({ userId: id, message: `User ${id} was deleted by admin`, read: false });
          return true;
        },

        searchUsers: (query: string) => {
          const q = query.trim().toLowerCase();
          if (!q) return get().users;
          return get().users.filter((u) => {
            return (
              u.email.toLowerCase().includes(q) ||
              `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
              u.id.toLowerCase().includes(q) ||
              (u.role || '').toLowerCase().includes(q)
            );
          });
        },

        fetchNotifications: () => {
          return get().notifications;
        },

        markNotificationRead: (id: string) => {
          set((state) => ({
            notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          }));
        },

        addNotification: (note) => {
          const newNote: AdminNotification = {
            id: `n_${Date.now()}`,
            userId: note.userId,
            message: note.message,
            read: note.read || false,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({ notifications: [newNote, ...state.notifications] }));
        },
      }),
      {
        name: 'admin-storage',
        partialize: (state) => ({ users: state.users, notifications: state.notifications }),
      }
    ),
    { name: 'admin-store' }
  )
);
