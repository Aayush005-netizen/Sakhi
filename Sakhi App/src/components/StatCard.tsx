import React from 'react';
import { Card } from './ui/card';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
  gradient?: boolean;
}

export function StatCard({ icon, label, value, subtitle, gradient }: StatCardProps) {
  return (
    <Card 
      className={`p-4 rounded-3xl shadow-sm border-none ${
        gradient 
          ? 'bg-gradient-to-br from-primary to-secondary text-white' 
          : 'bg-card'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`text-2xl ${gradient ? '' : 'opacity-80'}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs opacity-75 ${gradient ? 'text-white' : 'text-muted-foreground'}`}>
            {label}
          </div>
          <div className={`mt-0.5 ${gradient ? 'text-white' : 'text-foreground'}`}>
            {value}
          </div>
          {subtitle && (
            <div className={`text-xs mt-0.5 ${gradient ? 'text-white/80' : 'text-muted-foreground'}`}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
