import React, { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-secondary to-primary flex flex-col items-center justify-center">
      <div className="animate-fade-in">
        <div className="text-8xl mb-6 animate-pulse-soft">🌸</div>
        <h1 className="text-white text-center mb-2">Sakhi</h1>
        <p className="text-white/90 text-center">Your PCOS Companion</p>
      </div>
    </div>
  );
}
