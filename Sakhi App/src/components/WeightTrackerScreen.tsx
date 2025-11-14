import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { TopBar } from './TopBar';

export function WeightTrackerScreen() {
  const { weightEntries, addWeightEntry } = useApp();
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const goalWeight = 58; // Could be made configurable

  const chartData = useMemo(() => {
    return weightEntries
      .slice()
      .reverse()
      .slice(0, 20)
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: entry.weight
      }));
  }, [weightEntries]);

  const currentWeight = weightEntries[0]?.weight || 0;
  
  const weightChange = useMemo(() => {
    if (weightEntries.length < 2) return null;
    const oldest = weightEntries[weightEntries.length - 1].weight;
    const newest = weightEntries[0].weight;
    return newest - oldest;
  }, [weightEntries]);

  const handleSave = () => {
    if (!weight || !date) {
      toast.error('Please fill in all fields');
      return;
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    addWeightEntry({
      date,
      weight: weightNum,
      time: 'morning'
    });

    toast.success('Weight entry saved! 🌸');
    setOpen(false);
    setWeight('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="pb-24">
      {/* Top Bar */}
      <TopBar 
        title="Weight Tracker"
        subtitle="Track your progress over time"
      />

      <div className="px-6 space-y-6">

      {/* Current Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 rounded-3xl border-none shadow-sm">
          <div className="text-2xl mb-2">⚖️</div>
          <p className="text-xs text-muted-foreground">Current Weight</p>
          <h3 className="mt-1">62.0 kg</h3>
        </Card>
        <Card className="p-5 rounded-3xl border-none shadow-sm">
          <div className="text-2xl mb-2">🎯</div>
          <p className="text-xs text-muted-foreground">Goal Weight</p>
          <h3 className="mt-1">58.0 kg</h3>
        </Card>
      </div>

      {/* Insight Card */}
      <Card className="p-5 rounded-3xl border-none bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-green-900 dark:text-green-100">Great Progress! ✨</h4>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              You've lost 2.5 kg this month. Keep up the excellent work!
            </p>
          </div>
        </div>
      </Card>

      {/* Chart */}
      {chartData.length > 0 ? (
        <Card className="p-5 rounded-3xl border-none shadow-sm">
          <h3 className="mb-4">Weight Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D96D77" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D96D77" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#8B8FA3"
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12 }}
                stroke="#8B8FA3"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFF7F2',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#D96D77"
                strokeWidth={3}
                fill="url(#weightGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        </Card>
      ) : (
        <Card className="p-8 rounded-3xl border-none shadow-sm text-center">
          <div className="text-4xl mb-3">📊</div>
          <h4 className="mb-2">Start Tracking Your Weight</h4>
          <p className="text-sm text-muted-foreground">
            Add your first entry to see your progress over time
          </p>
        </Card>
      )}

      {/* History */}
      {weightEntries.length > 0 && (
        <div>
          <h3 className="mb-4">Recent Entries</h3>
          <div className="space-y-3">
            {weightEntries.slice(0, 5).map((entry, index) => (
              <Card key={index} className="p-4 rounded-2xl border-none shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {entry.time === 'morning' ? 'Morning' : 'Evening'} weigh-in
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{entry.weight} kg</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Weight FAB */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-white hover:bg-primary/90 active:scale-95 transition-all">
            <Plus className="w-6 h-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Add Weight Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="weight-input">Weight (kg)</Label>
              <Input
                id="weight-input"
                type="number"
                step="0.1"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="rounded-2xl bg-input-background border-none h-12 mt-2"
              />
            </div>
            <div>
              <Label htmlFor="date-input">Date</Label>
              <Input
                id="date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
