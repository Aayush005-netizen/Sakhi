import React from 'react';
import { Card } from './ui/card';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export function QuickActionButton({ icon, label, onClick }: QuickActionButtonProps) {
  return (
    <Card 
      className="p-4 rounded-3xl shadow-sm border-none bg-card cursor-pointer hover:shadow-md transition-all active:scale-95"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="text-3xl">{icon}</div>
        <div className="text-xs text-center">{label}</div>
      </div>
    </Card>
  );
}
