import React, { useMemo, useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import { QuickActionButton } from './QuickActionButton';
import { Card } from './ui/card';
import { Sparkles, Bell } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { TopBar } from './TopBar';
import { MotivationalNudge } from './MotivationalNudge';
import { initializeWellnessReminders } from '../utils/wellnessReminders';
import { toast } from 'sonner@2.0.3';
import { getTranslation } from '../utils/translations';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user, cycleEntries, weightEntries, getStats, getLatestAssessment, settings } = useApp();
  const stats = getStats();
  const latestAssessment = getLatestAssessment();
  const t = getTranslation(settings.language);
  const [showNotifications, setShowNotifications] = useState(false);

  // Show welcome message for new users
  useEffect(() => {
    if (cycleEntries.length === 0 && weightEntries.length === 0) {
      const hasShownWelcome = localStorage.getItem('sakhi_welcome_shown');
      if (!hasShownWelcome) {
        setTimeout(() => {
          toast.success('Welcome to Sakhi! Start by tracking your cycle or weight 🌸');
          localStorage.setItem('sakhi_welcome_shown', 'true');
        }, 1000);
      }
    }
  }, [cycleEntries.length, weightEntries.length]);

  // Initialize wellness reminders
  useEffect(() => {
    if (settings.notifications && settings.wellnessReminders) {
      const cleanup = initializeWellnessReminders(
        settings.wellnessReminders,
        (reminder) => {
          toast(reminder.message, {
            icon: reminder.icon,
            duration: 5000,
          });
        }
      );
      
      return cleanup;
    }
  }, [settings.notifications, settings.wellnessReminders]);

  // Get last period date
  const lastPeriod = useMemo(() => {
    const periodEntry = cycleEntries.find(e => e.isPeriod);
    if (periodEntry) {
      const date = new Date(periodEntry.date);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return { daysAgo: diff, date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
    }
    return null;
  }, [cycleEntries]);

  // Get today's mood
  const todayMood = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const entry = cycleEntries.find(e => e.date === today);
    return entry?.mood || 'Not logged';
  }, [cycleEntries]);

  // Get next period prediction
  const nextPeriod = useMemo(() => {
    if (lastPeriod && stats.avgCycleLength) {
      const lastDate = new Date(lastPeriod.date);
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + stats.avgCycleLength);
      const daysUntil = Math.floor((nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return { date: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), daysUntil };
    }
    return null;
  }, [lastPeriod, stats.avgCycleLength]);

  return (
    <div className="pb-24">
      {/* Top Bar */}
      <TopBar 
        variant="transparent"
        rightContent={
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full bg-card hover:bg-muted flex items-center justify-center transition-colors relative active:scale-95"
          >
            <Bell className="w-5 h-5" />
            {settings.notifications && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        }
      />

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="fixed top-16 right-6 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 p-4 animate-fade-in">
          <h4 className="mb-3">{t.notifications}</h4>
          <div className="space-y-2">
            <div className="p-3 bg-primary/10 rounded-xl">
              <p className="text-sm">🎉 New AI tip available!</p>
              <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-sm">📅 Period expected in 3 days</p>
              <p className="text-xs text-muted-foreground mt-1">Today</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-sm">💪 Time for your workout!</p>
              <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNotifications(false)}
            className="w-full mt-3 text-sm text-primary hover:underline"
          >
            Close
          </button>
        </div>
      )}

      <div className="px-6 space-y-6">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h2>{t.hiThere}, {user?.name || 'there'} 👋</h2>
          <p className="text-muted-foreground">{t.howFeelingToday}</p>
        </div>

        {/* Motivational Nudge */}
        {settings.motivationalNudges && <MotivationalNudge />}

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon="💗"
          label={t.pcosRiskScore}
          value={latestAssessment ? latestAssessment.riskLevel.charAt(0).toUpperCase() + latestAssessment.riskLevel.slice(1) : t.notAssessed}
          subtitle={latestAssessment ? `${Math.round(latestAssessment.percentage)}% risk` : t.takeAssessment}
          gradient={!!latestAssessment}
        />
        <StatCard
          icon="📅"
          label={t.lastPeriod}
          value={lastPeriod ? `${lastPeriod.daysAgo} ${t.daysAgo}` : t.notTracked}
          subtitle={lastPeriod?.date}
        />
        <StatCard
          icon="😊"
          label={t.todaysMood}
          value={todayMood || t.notLogged}
        />
        <StatCard
          icon="⚖️"
          label={t.currentWeight}
          value={stats.currentWeight ? `${stats.currentWeight} kg` : t.notTracked}
          subtitle={weightEntries.length > 1 ? 'Tracking...' : 'Add entry'}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4">{t.quickActions}</h3>
        <div className="grid grid-cols-3 gap-3">
          <QuickActionButton
            icon="🧠"
            label={t.assessment}
            onClick={() => onNavigate('assessment')}
          />
          <QuickActionButton
            icon="✨"
            label={t.askAI}
            onClick={() => onNavigate('ai')}
          />
          <QuickActionButton
            icon="📈"
            label={t.reports}
            onClick={() => onNavigate('reports')}
          />
        </div>
      </div>

      {/* AI Tip of the Day */}
      <Card className="p-6 rounded-3xl border-none bg-gradient-to-br from-secondary/20 to-accent/20 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4>{t.todaysAITip}</h4>
              <span className="text-xs bg-secondary/40 px-2 py-1 rounded-full">{t.personalized}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {settings.language === 'hi' 
                ? 'अपनी दैनिक दिनचर्या में स्पीयरमिंट चाय शामिल करने का प्रयास करें। अध्ययनों से पता चलता है कि यह अतिरिक्त एंड्रोजन को कम करने में मदद कर सकती है। 🍵'
                : 'Try incorporating spearmint tea into your daily routine. Studies show it can help reduce excess androgens and improve PCOS symptoms. 🍵'
              }
            </p>
            <button 
              onClick={() => onNavigate('ai')}
              className="text-sm text-primary mt-3 hover:underline active:scale-95"
            >
              {t.learnMore} →
            </button>
          </div>
        </div>
      </Card>

      {/* Upcoming Section */}
      {nextPeriod && (
        <div>
          <h3 className="mb-4">{t.upcoming}</h3>
          <Card className="p-4 rounded-3xl border-none shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="flex-1">
                <h4>{t.expectedPeriod}</h4>
                <p className="text-sm text-muted-foreground">
                  {t.inDays} {nextPeriod.daysUntil} {t.daysAgo} · {nextPeriod.date}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Health Insights */}
      <div>
        <h3 className="mb-4">{t.healthInsights}</h3>
        <div className="space-y-3">
          <Card className="p-4 rounded-3xl border-none shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💪</span>
              <div className="flex-1">
                <p className="text-sm">You've completed 3 workouts this week!</p>
                <p className="text-xs text-muted-foreground mt-1">Keep up the great work</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 rounded-3xl border-none shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥗</span>
              <div className="flex-1">
                <p className="text-sm">Your diet plan is ready for next week</p>
                <button 
                  className="text-xs text-primary mt-1 hover:underline"
                  onClick={() => onNavigate('plans')}
                >
                  View Plan →
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
