import React from 'react';
import { Home, Calendar, Sparkles, FileText, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'tracker', label: 'Tracker', icon: Calendar },
  { id: 'ai', label: 'AI', icon: Sparkles },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center gap-1 min-w-[60px] transition-all relative"
              >
                <div className={`relative ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Icon className={`w-6 h-6 transition-all ${isActive ? 'scale-110' : ''}`} />
                  {isActive && (
                    <div className="absolute -inset-2 bg-primary/10 rounded-2xl -z-10 animate-fade-in" />
                  )}
                </div>
                <span className={`text-xs transition-all ${
                  isActive ? 'text-primary opacity-100' : 'text-muted-foreground opacity-70'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
