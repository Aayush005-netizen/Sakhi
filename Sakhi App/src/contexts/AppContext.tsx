import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
}

export interface CycleEntry {
  date: string;
  isPeriod: boolean;
  mood?: string;
  weight?: number;
  symptoms?: string[];
  notes?: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
  time: 'morning' | 'evening';
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  saved?: boolean;
}

export interface HealthReport {
  id: string;
  type: 'blood' | 'ultrasound';
  name: string;
  date: string;
  data: any;
}

export interface Assessment {
  date: string;
  score: number;
  maxScore: number;
  percentage: number;
  riskLevel: 'low' | 'moderate' | 'high';
  answers: Record<string, string>;
}

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  language: 'en' | 'hi';
  researchConsent: boolean;
  motivationalNudges: boolean;
  wellnessReminders: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
}

interface AppContextType {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  
  // Cycle Tracking
  cycleEntries: CycleEntry[];
  addCycleEntry: (entry: CycleEntry) => void;
  updateCycleEntry: (date: string, entry: Partial<CycleEntry>) => void;
  getCycleEntry: (date: string) => CycleEntry | undefined;
  
  // Weight Tracking
  weightEntries: WeightEntry[];
  addWeightEntry: (entry: WeightEntry) => void;
  deleteWeightEntry: (date: string) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  toggleSaveMessage: (id: number) => void;
  
  // Reports
  reports: HealthReport[];
  addReport: (report: HealthReport) => void;
  deleteReport: (id: string) => void;
  
  // Assessment
  assessments: Assessment[];
  saveAssessment: (assessment: Assessment) => void;
  getLatestAssessment: () => Assessment | undefined;
  
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Subscription
  subscriptionTier: 'free' | 'pro' | 'premium';
  setSubscriptionTier: (tier: 'free' | 'pro' | 'premium') => void;
  
  // Stats
  getStats: () => {
    daysTracked: number;
    totalChats: number;
    totalReports: number;
    currentWeight: number;
    avgCycleLength: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'sakhi_app_data';

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cycleEntries, setCycleEntries] = useState<CycleEntry[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hello! I'm Sakhi, your PCOS companion. I'm here to answer your questions about PCOS, provide personalized advice, and support you on your health journey. How can I help you today? 🌸",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
  ]);
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    notifications: true,
    language: 'en',
    researchConsent: false,
    motivationalNudges: true,
    wellnessReminders: {
      morning: true,
      afternoon: true,
      evening: true,
    },
  });
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'premium'>('free');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.user) setUser(data.user);
        if (data.cycleEntries) setCycleEntries(data.cycleEntries);
        if (data.weightEntries) setWeightEntries(data.weightEntries);
        if (data.chatMessages) setChatMessages(data.chatMessages);
        if (data.reports) setReports(data.reports);
        if (data.assessments) setAssessments(data.assessments);
        if (data.settings) setSettings(data.settings);
        if (data.subscriptionTier) setSubscriptionTier(data.subscriptionTier);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data = {
      user,
      cycleEntries,
      weightEntries,
      chatMessages,
      reports,
      assessments,
      settings,
      subscriptionTier,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [user, cycleEntries, weightEntries, chatMessages, reports, assessments, settings, subscriptionTier]);

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const addCycleEntry = (entry: CycleEntry) => {
    setCycleEntries(prev => {
      const filtered = prev.filter(e => e.date !== entry.date);
      return [...filtered, entry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  const updateCycleEntry = (date: string, update: Partial<CycleEntry>) => {
    setCycleEntries(prev => prev.map(entry => 
      entry.date === date ? { ...entry, ...update } : entry
    ));
  };

  const getCycleEntry = (date: string) => {
    return cycleEntries.find(e => e.date === date);
  };

  const addWeightEntry = (entry: WeightEntry) => {
    setWeightEntries(prev => {
      const filtered = prev.filter(e => e.date !== entry.date);
      return [...filtered, entry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  const deleteWeightEntry = (date: string) => {
    setWeightEntries(prev => prev.filter(e => e.date !== date));
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now() + Math.random(), // Use timestamp + random to ensure uniqueness
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const toggleSaveMessage = (id: number) => {
    setChatMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, saved: !msg.saved } : msg
    ));
  };

  const addReport = (report: HealthReport) => {
    setReports(prev => [report, ...prev]);
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const saveAssessment = (assessment: Assessment) => {
    setAssessments(prev => [assessment, ...prev]);
  };

  const getLatestAssessment = () => {
    return assessments[0];
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getStats = () => {
    const daysTracked = cycleEntries.length;
    const totalChats = chatMessages.filter(m => m.sender === 'user').length;
    const totalReports = reports.length;
    const currentWeight = weightEntries[0]?.weight || 0;
    
    // Calculate average cycle length
    const periodDates = cycleEntries
      .filter(e => e.isPeriod)
      .map(e => new Date(e.date))
      .sort((a, b) => a.getTime() - b.getTime());
    
    let avgCycleLength = 28;
    if (periodDates.length >= 2) {
      const cycles = [];
      for (let i = 1; i < periodDates.length; i++) {
        const diff = Math.floor((periodDates[i].getTime() - periodDates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
        cycles.push(diff);
      }
      avgCycleLength = Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length);
    }
    
    return {
      daysTracked,
      totalChats,
      totalReports,
      currentWeight,
      avgCycleLength,
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        cycleEntries,
        addCycleEntry,
        updateCycleEntry,
        getCycleEntry,
        weightEntries,
        addWeightEntry,
        deleteWeightEntry,
        chatMessages,
        addChatMessage,
        toggleSaveMessage,
        reports,
        addReport,
        deleteReport,
        assessments,
        saveAssessment,
        getLatestAssessment,
        settings,
        updateSettings,
        subscriptionTier,
        setSubscriptionTier,
        getStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
