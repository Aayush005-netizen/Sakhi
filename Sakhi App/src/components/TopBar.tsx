import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backButton?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenu?: () => void;
  rightContent?: React.ReactNode;
  variant?: 'default' | 'transparent';
}

export function TopBar({ 
  title, 
  subtitle, 
  showBack = false,
  backButton = false,
  onBack, 
  showMenu = false, 
  onMenu,
  rightContent,
  variant = 'default'
}: TopBarProps) {
  const shouldShowBack = showBack || backButton;
  return (
    <div className={`sticky top-0 z-50 px-6 py-4 ${
      variant === 'transparent' 
        ? 'bg-transparent' 
        : 'bg-background/95 backdrop-blur-sm border-b border-border/50'
    }`}>
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1">
          {shouldShowBack && (
            <button
              onClick={onBack || (() => window.history.back())}
              className="w-10 h-10 rounded-full bg-card hover:bg-muted flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          {title && (
            <div className="flex-1">
              <h2 className="truncate">{title}</h2>
              {subtitle && (
                <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {rightContent}
          
          {showMenu && (
            <button
              onClick={onMenu}
              className="w-10 h-10 rounded-full bg-card hover:bg-muted flex items-center justify-center transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
