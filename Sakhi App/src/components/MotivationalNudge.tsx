import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Sparkles, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

export function MotivationalNudge() {
  const { settings } = useApp();
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const t = getTranslation(settings.language);

  useEffect(() => {
    // Don't show nudge if disabled
    if (!settings.motivationalNudges) {
      return;
    }

    // Check if we've already shown a nudge today
    const lastShown = localStorage.getItem('sakhi_last_nudge');
    const today = new Date().toDateString();
    
    if (lastShown === today) {
      return;
    }

    // Show nudge after a delay
    const timer = setTimeout(() => {
      const messages = t.motivationalMessages;
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
      setIsVisible(true);
      localStorage.setItem('sakhi_last_nudge', today);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, [settings.motivationalNudges, t]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !currentMessage) {
    return null;
  }

  return (
    <Card className="p-4 rounded-3xl border-none bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm">Daily Motivation</h4>
            <button
              onClick={handleDismiss}
              className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentMessage}
          </p>
        </div>
      </div>
    </Card>
  );
}
