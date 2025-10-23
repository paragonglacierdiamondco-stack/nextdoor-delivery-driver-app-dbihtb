
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DeliveryStatus = 'pending' | 'in-progress' | 'delivered' | 'exception';

export interface Delivery {
  id: string;
  packageNumber: string;
  recipient: string;
  address: string;
  phone: string;
  status: DeliveryStatus;
  priority: 'high' | 'normal' | 'low';
  timeWindow: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  scannedAt?: string;
  startedAt?: string;
  completedAt?: string;
  proofPhoto?: string;
  signature?: string;
  packageCount?: number; // Assigned by dispatch
  routeOrder?: number; // Route planning assigned by dispatch
}

export interface DeliveryBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  area: string;
  estimatedPackages: number;
  rate: string;
  status: 'available' | 'scheduled' | 'completed';
}

export interface Issue {
  id: string;
  deliveryId: string;
  type: string;
  description: string;
  photo?: string;
  timestamp: string;
}

export interface Statistics {
  todayDeliveries: number;
  todayCompleted: number;
  todayPending: number;
  todayEarnings: number;
  weeklyDeliveries: number;
  weeklyEarnings: number;
  totalDeliveries: number;
  totalEarnings: number;
  successRate: number;
  rating: number;
}

interface AppContextType {
  isLoggedIn: boolean;
  deliveries: Delivery[];
  deliveryBlocks: DeliveryBlock[];
  issues: Issue[];
  statistics: Statistics;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateDelivery: (id: string, updates: Partial<Delivery>) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
  scheduleBlock: (blockId: string) => Promise<void>;
  cancelBlock: (blockId: string) => Promise<void>;
  reportIssue: (issue: Omit<Issue, 'id' | 'timestamp'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  IS_LOGGED_IN: '@app:isLoggedIn',
  DELIVERIES: '@app:deliveries',
  DELIVERY_BLOCKS: '@app:deliveryBlocks',
  ISSUES: '@app:issues',
  STATISTICS: '@app:statistics',
};

// Initial deliveries are now pre-assigned by dispatch with route order and package counts
const initialDeliveries: Delivery[] = [
  {
    id: '1',
    packageNumber: 'PKG-12345',
    recipient: 'John Smith',
    address: '123 Main St, Apt 4B',
    phone: '(555) 123-4567',
    status: 'pending',
    priority: 'high',
    timeWindow: '10:00 AM - 12:00 PM',
    notes: 'Leave at door if no answer',
    latitude: 37.7749,
    longitude: -122.4194,
    packageCount: 2, // Assigned by dispatch
    routeOrder: 1, // Route planning by dispatch
  },
  {
    id: '2',
    packageNumber: 'PKG-12346',
    recipient: 'Sarah Johnson',
    address: '456 Oak Ave',
    phone: '(555) 234-5678',
    status: 'pending',
    priority: 'normal',
    timeWindow: '12:00 PM - 2:00 PM',
    latitude: 37.7849,
    longitude: -122.4094,
    packageCount: 1, // Assigned by dispatch
    routeOrder: 2, // Route planning by dispatch
  },
  {
    id: '3',
    packageNumber: 'PKG-12347',
    recipient: 'Mike Davis',
    address: '789 Pine Rd, Unit 12',
    phone: '(555) 345-6789',
    status: 'delivered',
    priority: 'normal',
    timeWindow: '9:00 AM - 11:00 AM',
    latitude: 37.7649,
    longitude: -122.4294,
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    packageCount: 3, // Assigned by dispatch
    routeOrder: 3, // Route planning by dispatch
  },
  {
    id: '4',
    packageNumber: 'PKG-12348',
    recipient: 'Emily Brown',
    address: '321 Elm St',
    phone: '(555) 456-7890',
    status: 'pending',
    priority: 'low',
    timeWindow: '2:00 PM - 4:00 PM',
    latitude: 37.7549,
    longitude: -122.4394,
    packageCount: 1, // Assigned by dispatch
    routeOrder: 4, // Route planning by dispatch
  },
];

const initialBlocks: DeliveryBlock[] = [
  {
    id: '1',
    date: 'Today',
    startTime: '8:00 AM',
    endTime: '12:00 PM',
    duration: '4 hours',
    area: 'Downtown',
    estimatedPackages: 25,
    rate: '$80',
    status: 'scheduled',
  },
  {
    id: '2',
    date: 'Today',
    startTime: '1:00 PM',
    endTime: '5:00 PM',
    duration: '4 hours',
    area: 'Suburbs',
    estimatedPackages: 30,
    rate: '$90',
    status: 'available',
  },
  {
    id: '3',
    date: 'Tomorrow',
    startTime: '9:00 AM',
    endTime: '1:00 PM',
    duration: '4 hours',
    area: 'North Side',
    estimatedPackages: 20,
    rate: '$75',
    status: 'available',
  },
  {
    id: '4',
    date: 'Tomorrow',
    startTime: '2:00 PM',
    endTime: '6:00 PM',
    duration: '4 hours',
    area: 'East Side',
    estimatedPackages: 28,
    rate: '$85',
    status: 'available',
  },
];

const initialStatistics: Statistics = {
  todayDeliveries: 12,
  todayCompleted: 8,
  todayPending: 4,
  todayEarnings: 96,
  weeklyDeliveries: 67,
  weeklyEarnings: 320,
  totalDeliveries: 1234,
  totalEarnings: 12450,
  successRate: 98.5,
  rating: 4.9,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [deliveryBlocks, setDeliveryBlocks] = useState<DeliveryBlock[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [statistics, setStatistics] = useState<Statistics>(initialStatistics);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        storedIsLoggedIn,
        storedDeliveries,
        storedBlocks,
        storedIssues,
        storedStats,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN),
        AsyncStorage.getItem(STORAGE_KEYS.DELIVERIES),
        AsyncStorage.getItem(STORAGE_KEYS.DELIVERY_BLOCKS),
        AsyncStorage.getItem(STORAGE_KEYS.ISSUES),
        AsyncStorage.getItem(STORAGE_KEYS.STATISTICS),
      ]);

      setIsLoggedIn(storedIsLoggedIn === 'true');
      setDeliveries(storedDeliveries ? JSON.parse(storedDeliveries) : initialDeliveries);
      setDeliveryBlocks(storedBlocks ? JSON.parse(storedBlocks) : initialBlocks);
      setIssues(storedIssues ? JSON.parse(storedIssues) : []);
      setStatistics(storedStats ? JSON.parse(storedStats) : initialStatistics);
    } catch (error) {
      console.error('Error loading data:', error);
      setDeliveries(initialDeliveries);
      setDeliveryBlocks(initialBlocks);
      setStatistics(initialStatistics);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      setIsLoggedIn(true);
      console.log('User logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
      setIsLoggedIn(false);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateDelivery = async (id: string, updates: Partial<Delivery>) => {
    try {
      // Prevent drivers from modifying dispatch-controlled fields
      const restrictedFields = ['packageCount', 'routeOrder', 'packageNumber', 'address', 'recipient'];
      const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
        if (!restrictedFields.includes(key)) {
          acc[key] = updates[key];
        } else {
          console.log(`Field "${key}" is controlled by dispatch and cannot be modified by drivers`);
        }
        return acc;
      }, {} as Partial<Delivery>);

      const newDeliveries = deliveries.map(d =>
        d.id === id ? { ...d, ...filteredUpdates } : d
      );
      await AsyncStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(newDeliveries));
      setDeliveries(newDeliveries);
      await updateStatistics();
      console.log('Delivery updated:', id, filteredUpdates);
    } catch (error) {
      console.error('Error updating delivery:', error);
    }
  };

  const deleteDelivery = async (id: string) => {
    try {
      // Note: In production, drivers should not be able to delete deliveries
      // This would be a dispatch-only operation
      console.log('Warning: Delivery deletion should be restricted to dispatch only');
      const newDeliveries = deliveries.filter(d => d.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(newDeliveries));
      setDeliveries(newDeliveries);
      await updateStatistics();
      console.log('Delivery deleted:', id);
    } catch (error) {
      console.error('Error deleting delivery:', error);
    }
  };

  const scheduleBlock = async (blockId: string) => {
    try {
      const newBlocks = deliveryBlocks.map(b =>
        b.id === blockId ? { ...b, status: 'scheduled' as const } : b
      );
      await AsyncStorage.setItem(STORAGE_KEYS.DELIVERY_BLOCKS, JSON.stringify(newBlocks));
      setDeliveryBlocks(newBlocks);
      console.log('Block scheduled:', blockId);
    } catch (error) {
      console.error('Error scheduling block:', error);
    }
  };

  const cancelBlock = async (blockId: string) => {
    try {
      const newBlocks = deliveryBlocks.map(b =>
        b.id === blockId ? { ...b, status: 'available' as const } : b
      );
      await AsyncStorage.setItem(STORAGE_KEYS.DELIVERY_BLOCKS, JSON.stringify(newBlocks));
      setDeliveryBlocks(newBlocks);
      console.log('Block cancelled:', blockId);
    } catch (error) {
      console.error('Error cancelling block:', error);
    }
  };

  const reportIssue = async (issue: Omit<Issue, 'id' | 'timestamp'>) => {
    try {
      const newIssue: Issue = {
        ...issue,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const newIssues = [...issues, newIssue];
      await AsyncStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(newIssues));
      setIssues(newIssues);
      console.log('Issue reported:', newIssue);
    } catch (error) {
      console.error('Error reporting issue:', error);
    }
  };

  const updateStatistics = async () => {
    try {
      const today = new Date().toDateString();
      const todayDeliveries = deliveries.filter(d => {
        const deliveryDate = d.completedAt ? new Date(d.completedAt).toDateString() : null;
        return deliveryDate === today || d.status === 'pending' || d.status === 'in-progress';
      });

      const completed = deliveries.filter(d => d.status === 'delivered');
      const todayCompleted = todayDeliveries.filter(d => d.status === 'delivered');

      const newStats: Statistics = {
        todayDeliveries: todayDeliveries.length,
        todayCompleted: todayCompleted.length,
        todayPending: todayDeliveries.filter(d => d.status === 'pending').length,
        todayEarnings: todayCompleted.length * 8,
        weeklyDeliveries: completed.length,
        weeklyEarnings: completed.length * 8,
        totalDeliveries: statistics.totalDeliveries + (todayCompleted.length > statistics.todayCompleted ? 1 : 0),
        totalEarnings: statistics.totalEarnings + (todayCompleted.length > statistics.todayCompleted ? 8 : 0),
        successRate: completed.length > 0 ? (completed.length / deliveries.length) * 100 : 98.5,
        rating: 4.9,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(newStats));
      setStatistics(newStats);
    } catch (error) {
      console.error('Error updating statistics:', error);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  if (isLoading) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        deliveries,
        deliveryBlocks,
        issues,
        statistics,
        login,
        logout,
        updateDelivery,
        deleteDelivery,
        scheduleBlock,
        cancelBlock,
        reportIssue,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
