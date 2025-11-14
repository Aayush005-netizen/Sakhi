import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, Sparkles, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TopBar } from './TopBar';
import { generateDietPlan } from '../utils/dietPlanGenerator';
import { toast } from 'sonner@2.0.3';

// Initial diet plan will be generated dynamically

const workoutPlan = [
  {
    day: 'Monday',
    type: 'Strength Training',
    duration: '45 mins',
    exercises: ['Squats - 3 sets of 12', 'Lunges - 3 sets of 10', 'Push-ups - 3 sets of 8', 'Plank - 3 sets of 30s']
  },
  {
    day: 'Tuesday',
    type: 'Cardio & Yoga',
    duration: '40 mins',
    exercises: ['Brisk walking - 20 mins', 'Sun Salutation - 5 rounds', 'Surya Namaskar', 'Pranayama - 10 mins']
  },
  {
    day: 'Wednesday',
    type: 'HIIT Workout',
    duration: '30 mins',
    exercises: ['Burpees - 3 sets of 10', 'Mountain climbers - 3 sets of 15', 'Jump squats - 3 sets of 12', 'Rest intervals - 30s']
  }
];

export function PlansScreen() {
  const [dietPlan, setDietPlan] = useState(() => generateDietPlan());
  const [openDays, setOpenDays] = useState<string[]>(['Monday']);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const toggleDay = (day: string) => {
    setOpenDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleRegenerateDietPlan = () => {
    setIsRegenerating(true);
    
    // Simulate AI generation with a small delay for better UX
    setTimeout(() => {
      const newPlan = generateDietPlan(new Date());
      setDietPlan(newPlan);
      setIsRegenerating(false);
      toast.success('New diet plan generated! 🥗 Fresh PCOS-friendly meals await you!');
    }, 1000);
  };

  return (
    <div className="pb-24">
      {/* Top Bar */}
      <TopBar 
        title="Personalized Plans"
        subtitle="AI-curated diet and workout plans"
      />

      <div className="px-6 space-y-6">

      {/* Hero Card */}
      <Card className="p-5 rounded-3xl border-none bg-gradient-to-br from-primary/10 to-secondary/10 shadow-sm overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3>Your Plans</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Tailored specifically for PCOS management and your lifestyle
            </p>
          </div>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1642339800099-921df1a0a958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMGJvd2x8ZW58MXx8fHwxNzYzMDA4ODY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Healthy food"
            className="w-20 h-20 rounded-2xl object-cover"
          />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="diet" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-12 bg-muted/50 rounded-2xl p-1">
          <TabsTrigger value="diet" className="rounded-xl">
            🥗 Diet Plan
          </TabsTrigger>
          <TabsTrigger value="workout" className="rounded-xl">
            💪 Workout Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diet" className="mt-6 space-y-4">
          {dietPlan.map((dayPlan) => (
            <Collapsible
              key={dayPlan.day}
              open={openDays.includes(dayPlan.day)}
              onOpenChange={() => toggleDay(dayPlan.day)}
            >
              <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">🍽️</span>
                    </div>
                    <div className="text-left">
                      <h4>{dayPlan.day}</h4>
                      <p className="text-xs text-muted-foreground">3 meals planned</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openDays.includes(dayPlan.day) ? 'rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-5 pb-5 space-y-4">
                    <div className="space-y-3">
                      {/* Breakfast */}
                      <div className="bg-muted/30 rounded-2xl p-4">
                        <p className="mb-2 flex items-center gap-2">
                          <span>🌅</span> Breakfast
                        </p>
                        <ul className="space-y-1">
                          {dayPlan.meals.breakfast.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground pl-4">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Lunch */}
                      <div className="bg-muted/30 rounded-2xl p-4">
                        <p className="mb-2 flex items-center gap-2">
                          <span>☀️</span> Lunch
                        </p>
                        <ul className="space-y-1">
                          {dayPlan.meals.lunch.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground pl-4">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dinner */}
                      <div className="bg-muted/30 rounded-2xl p-4">
                        <p className="mb-2 flex items-center gap-2">
                          <span>🌙</span> Dinner
                        </p>
                        <ul className="space-y-1">
                          {dayPlan.meals.dinner.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground pl-4">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          <Button 
            onClick={handleRegenerateDietPlan}
            disabled={isRegenerating}
            className="w-full rounded-2xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 h-12"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Generating...' : 'Regenerate Diet Plan'}
          </Button>
        </TabsContent>

        <TabsContent value="workout" className="mt-6 space-y-4">
          {workoutPlan.map((dayPlan) => (
            <Card key={dayPlan.day} className="p-5 rounded-3xl border-none shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💪</span>
                </div>
                <div className="flex-1">
                  <h4>{dayPlan.day}</h4>
                  <p className="text-sm text-muted-foreground">{dayPlan.type}</p>
                  <p className="text-xs text-muted-foreground mt-1">⏱️ {dayPlan.duration}</p>
                </div>
              </div>
              <div className="bg-muted/30 rounded-2xl p-4">
                <p className="text-sm mb-3">Exercises</p>
                <ul className="space-y-2">
                  {dayPlan.exercises.map((exercise, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {exercise}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}

          <Button className="w-full rounded-2xl bg-gradient-to-r from-secondary to-accent text-white hover:opacity-90 h-12">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate New Workout Plan
          </Button>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
