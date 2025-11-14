import React, { useState } from 'react';
import { Button } from './ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: '📅',
    title: 'Track Your Cycle Easily',
    description: 'Monitor your menstrual cycle, mood, and symptoms effortlessly with our intuitive calendar interface.',
    gradient: 'from-pink-200 via-purple-200 to-pink-200'
  },
  {
    icon: '✨',
    title: 'AI-Powered PCOS Insights',
    description: 'Get personalized insights and answers to your PCOS questions from our intelligent AI assistant.',
    gradient: 'from-purple-200 via-blue-200 to-purple-200'
  },
  {
    icon: '🥗',
    title: 'Personalized Diet & Lifestyle',
    description: 'Receive customized meal plans and workout routines designed specifically for managing PCOS.',
    gradient: 'from-green-200 via-teal-200 to-green-200'
  }
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-background">
      <div className="h-full flex flex-col">
        {/* Skip Button */}
        <div className="p-6 flex justify-end">
          <button
            onClick={onComplete}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
          <div className={`w-64 h-64 rounded-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-12 shadow-lg`}>
            <div className="text-9xl">{slide.icon}</div>
          </div>

          <h2 className="text-center mb-4">{slide.title}</h2>
          <p className="text-center text-muted-foreground px-4 mb-12">
            {slide.description}
          </p>

          {/* Dots */}
          <div className="flex gap-2 mb-12">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-primary/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 flex gap-4">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleNext}
            className="flex-1 rounded-full bg-primary hover:bg-primary/90"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            {currentSlide < slides.length - 1 && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
