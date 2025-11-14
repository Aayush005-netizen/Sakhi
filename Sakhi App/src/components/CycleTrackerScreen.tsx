import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { TopBar } from './TopBar';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const moodEmojis = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '🤗', label: 'Calm' },
];

export function CycleTrackerScreen() {
  const { cycleEntries, addCycleEntry, getCycleEntry, getStats } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [weight, setWeight] = useState('');
  const [isPeriod, setIsPeriod] = useState(false);
  const [open, setOpen] = useState(false);

  const stats = getStats();

  // Get days in current month
  const monthDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentMonth]);

  const handleDateClick = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    
    // Load existing entry if any
    const entry = getCycleEntry(dateStr);
    if (entry) {
      setSelectedMood(entry.mood || '');
      setWeight(entry.weight?.toString() || '');
      setIsPeriod(entry.isPeriod);
    } else {
      setSelectedMood('');
      setWeight('');
      setIsPeriod(false);
    }
    
    setOpen(true);
  };

  const handleSave = () => {
    if (!selectedDate) return;

    addCycleEntry({
      date: selectedDate,
      isPeriod,
      mood: selectedMood || undefined,
      weight: weight ? parseFloat(weight) : undefined,
    });

    toast.success('Entry saved successfully! 🌸');
    setOpen(false);
    setSelectedMood('');
    setWeight('');
    setIsPeriod(false);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Get entry status for a day
  const getDayStatus = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = getCycleEntry(dateStr);
    return {
      hasPeriod: entry?.isPeriod || false,
      hasMood: !!entry?.mood,
    };
  };

  // Calculate next period prediction
  const nextPeriod = useMemo(() => {
    const lastPeriodEntry = cycleEntries.find(e => e.isPeriod);
    if (lastPeriodEntry && stats.avgCycleLength) {
      const lastDate = new Date(lastPeriodEntry.date);
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + stats.avgCycleLength);
      const daysUntil = Math.floor((nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return { date: nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), daysUntil };
    }
    return null;
  }, [cycleEntries, stats.avgCycleLength]);

  return (
    <div className="pb-24">
      {/* Top Bar */}
      <TopBar 
        title="Cycle & Mood Tracker"
        subtitle={currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        rightContent={
          <div className="flex gap-2">
            <button 
              onClick={previousMonth}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextMonth}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <div className="px-6 space-y-6">

      {/* Prediction Card */}
      {nextPeriod && (
        <Card className="p-5 rounded-3xl border-none bg-gradient-to-br from-primary/10 to-secondary/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">🔮</span>
            </div>
            <div>
              <h4>Next Period Prediction</h4>
              <p className="text-sm text-muted-foreground">{nextPeriod.date} · In {nextPeriod.daysUntil} days</p>
            </div>
          </div>
        </Card>
      )}

      {/* Calendar */}
      <Card className="p-5 rounded-3xl border-none shadow-sm">
        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }
            
            const status = getDayStatus(day);
            const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
            
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative hover:bg-muted/50 transition-colors ${
                  isToday ? 'bg-primary/10 border-2 border-primary' : ''
                }`}
              >
                <span className={`text-sm ${isToday ? 'text-primary' : ''}`}>{day}</span>
                <div className="flex gap-0.5 mt-1">
                  {status.hasPeriod && (
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                  {status.hasMood && (
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-muted-foreground">Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-xs text-muted-foreground">Mood Logged</span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 rounded-3xl border-none shadow-sm">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-xs text-muted-foreground">Avg Cycle Length</p>
          <h3>{stats.avgCycleLength} days</h3>
        </Card>
        <Card className="p-4 rounded-3xl border-none shadow-sm">
          <div className="text-2xl mb-2">📈</div>
          <p className="text-xs text-muted-foreground">Total Entries</p>
          <h3>{cycleEntries.length}</h3>
        </Card>
      </div>

      {/* FAB */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-white hover:bg-primary/90 active:scale-95 transition-all">
            <Plus className="w-6 h-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl max-w-[90%]">
          <DialogHeader>
            <DialogTitle>
              Add Entry {selectedDate && `- ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Mood Selector */}
            <div>
              <Label className="mb-3 block">How are you feeling?</Label>
              <div className="grid grid-cols-3 gap-3">
                {moodEmojis.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => setSelectedMood(mood.label)}
                    className={`p-3 rounded-2xl border-2 transition-all ${
                      selectedMood === mood.label
                        ? 'border-primary bg-primary/10'
                        : 'border-border'
                    }`}
                  >
                    <div className="text-3xl mb-1">{mood.emoji}</div>
                    <div className="text-xs">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Period Toggle */}
            <div>
              <Label className="mb-3 block">Period</Label>
              <button
                onClick={() => setIsPeriod(!isPeriod)}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  isPeriod
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                    : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{isPeriod ? '🔴 Period Day' : 'Mark as Period Day'}</span>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    isPeriod ? 'bg-red-500' : 'bg-muted'
                  }`}>
                    <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                      isPeriod ? 'translate-x-6' : ''
                    }`} />
                  </div>
                </div>
              </button>
            </div>

            {/* Weight Input */}
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="rounded-2xl bg-input-background border-none h-12 mt-2"
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full rounded-2xl bg-primary hover:bg-primary/90 h-12"
            >
              Save Entry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
