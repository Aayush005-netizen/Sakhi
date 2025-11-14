import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="p-8 rounded-3xl border-none shadow-sm text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="rounded-2xl bg-primary hover:bg-primary/90"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
