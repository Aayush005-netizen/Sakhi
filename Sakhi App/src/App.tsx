import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { AssessmentScreen } from './components/AssessmentScreen';
import { CycleTrackerScreen } from './components/CycleTrackerScreen';
import { WeightTrackerScreen } from './components/WeightTrackerScreen';
import { AIChatScreen } from './components/AIChatScreen';
import { PlansScreen } from './components/PlansScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { SubscriptionScreen } from './components/SubscriptionScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { AppProvider, useApp } from './contexts/AppContext';
import { Toaster } from './components/ui/sonner';
import './styles/globals.css';

type AppFlow = 'splash' | 'onboarding' | 'auth' | 'app';
type AppScreen = 'home' | 'assessment' | 'tracker' | 'weight' | 'ai' | 'plans' | 'reports' | 'subscription' | 'profile';

function AppContent() {
  const { isAuthenticated, setUser } = useApp();
  const [flow, setFlow] = useState<AppFlow>('splash');
  const [activeScreen, setActiveScreen] = useState<AppScreen>('home');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Check if user has seen onboarding before
  useEffect(() => {
    const seen = localStorage.getItem('sakhi_onboarding_seen');
    if (seen === 'true') {
      setHasSeenOnboarding(true);
    }
  }, []);

  // Skip to auth if onboarding already seen
  useEffect(() => {
    if (flow === 'onboarding' && hasSeenOnboarding) {
      setFlow('auth');
    }
  }, [flow, hasSeenOnboarding]);

  // Auto login if user exists
  useEffect(() => {
    if (isAuthenticated && flow !== 'app') {
      setFlow('app');
    }
  }, [isAuthenticated]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('sakhi_onboarding_seen', 'true');
    setHasSeenOnboarding(true);
    setFlow('auth');
  };

  const handleLogout = () => {
    setUser(null);
    setFlow('auth');
    setActiveScreen('home');
  };

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen as AppScreen);
  };

  // Render current flow
  if (flow === 'splash') {
    return <SplashScreen onComplete={() => setFlow('onboarding')} />;
  }

  if (flow === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (flow === 'auth') {
    return <AuthScreen onComplete={() => setFlow('app')} />;
  }

  // Main App with Mobile Frame
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-2 sm:p-4">
      {/* Mobile Frame - Responsive (full width on mobile, 390px on desktop) */}
      <div className="w-full sm:w-[390px] h-screen sm:h-[844px] bg-background sm:rounded-[3rem] shadow-2xl overflow-hidden relative">
        {/* Screen Content */}
        <div className="h-full overflow-y-auto">
          {activeScreen === 'home' && <HomeScreen onNavigate={handleNavigate} />}
          {activeScreen === 'assessment' && <AssessmentScreen />}
          {activeScreen === 'tracker' && <CycleTrackerScreen />}
          {activeScreen === 'weight' && <WeightTrackerScreen />}
          {activeScreen === 'ai' && <AIChatScreen />}
          {activeScreen === 'plans' && <PlansScreen />}
          {activeScreen === 'reports' && <ReportsScreen />}
          {activeScreen === 'subscription' && <SubscriptionScreen />}
          {activeScreen === 'profile' && <ProfileScreen onLogout={handleLogout} />}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeScreen} onTabChange={(tab) => setActiveScreen(tab as AppScreen)} />
      </div>
      
      {/* Toast Notifications */}
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
