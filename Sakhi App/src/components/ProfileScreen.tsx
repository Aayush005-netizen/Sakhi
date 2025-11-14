import React, { useState } from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { ChevronRight, Moon, Bell, Globe, Download, BookOpen, LogOut, Heart, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { TopBar } from './TopBar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { getLanguageName, type Language } from '../utils/translations';

interface ProfileScreenProps {
  onLogout: () => void;
}

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const { user, settings, updateSettings, getStats, cycleEntries, weightEntries, chatMessages } = useApp();
  const stats = getStats();
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [remindersDialogOpen, setRemindersDialogOpen] = useState(false);

  const toggleDarkMode = (checked: boolean) => {
    updateSettings({ darkMode: checked });
    toast.success(checked ? 'Dark mode enabled 🌙' : 'Light mode enabled ☀️');
  };

  const toggleNotifications = (checked: boolean) => {
    updateSettings({ notifications: checked });
    toast.success(checked ? 'Notifications enabled 🔔' : 'Notifications disabled');
  };

  const toggleResearchConsent = (checked: boolean) => {
    updateSettings({ researchConsent: checked });
    toast.success(checked ? 'Thank you for supporting PCOS research! 🙏' : 'Research consent disabled');
  };

  const handleExportData = () => {
    const data = {
      user,
      cycleEntries,
      weightEntries,
      chatMessages,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sakhi-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully! 📥');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
      toast.success('Logged out successfully. Take care! 🌸');
    }
  };

  const handleLanguageChange = (language: Language) => {
    updateSettings({ language });
    setLanguageDialogOpen(false);
    toast.success(`Language changed to ${getLanguageName(language)}! 🌐`);
  };

  const toggleMotivationalNudges = (checked: boolean) => {
    updateSettings({ motivationalNudges: checked });
    toast.success(checked ? 'Motivational nudges enabled 💪' : 'Motivational nudges disabled');
  };

  const toggleWellnessReminder = (time: 'morning' | 'afternoon' | 'evening', checked: boolean) => {
    updateSettings({
      wellnessReminders: {
        ...settings.wellnessReminders,
        [time]: checked,
      },
    });
    toast.success(`${time.charAt(0).toUpperCase() + time.slice(1)} reminder ${checked ? 'enabled' : 'disabled'} ⏰`);
  };

  return (
    <div className="pb-24">
      {/* Top Bar */}
      <TopBar 
        title="Profile"
        subtitle="Manage your account settings"
      />

      <div className="px-6 space-y-6">
      {/* Profile Header */}
      <Card className="p-6 rounded-3xl border-none shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-primary/20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3>{user?.name || 'User'}</h3>
            <p className="text-sm text-muted-foreground">{user?.email || 'No email'}</p>
            <button className="text-xs text-primary hover:underline mt-1">
              Edit Profile
            </button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 rounded-2xl border-none shadow-sm text-center">
          <p className="text-2xl mb-1">{stats.daysTracked}</p>
          <p className="text-xs text-muted-foreground">Days Tracked</p>
        </Card>
        <Card className="p-4 rounded-2xl border-none shadow-sm text-center">
          <p className="text-2xl mb-1">{stats.totalChats}</p>
          <p className="text-xs text-muted-foreground">AI Chats</p>
        </Card>
        <Card className="p-4 rounded-2xl border-none shadow-sm text-center">
          <p className="text-2xl mb-1">{stats.totalReports}</p>
          <p className="text-xs text-muted-foreground">Reports</p>
        </Card>
      </div>

      {/* Settings */}
      <div>
        <h3 className="mb-4">Settings</h3>
        <Card className="rounded-3xl border-none shadow-sm overflow-hidden divide-y divide-border">
          {/* Language */}
          <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm">Language</p>
                    <p className="text-xs text-muted-foreground">{getLanguageName(settings.language)}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[340px] rounded-3xl">
              <DialogHeader>
                <DialogTitle>Choose Language</DialogTitle>
                <DialogDescription>
                  Select your preferred language
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 mt-4">
                <Button
                  variant={settings.language === 'en' ? 'default' : 'outline'}
                  className="w-full justify-start rounded-2xl h-14"
                  onClick={() => handleLanguageChange('en')}
                >
                  <Globe className="w-5 h-5 mr-3" />
                  English
                </Button>
                <Button
                  variant={settings.language === 'hi' ? 'default' : 'outline'}
                  className="w-full justify-start rounded-2xl h-14"
                  onClick={() => handleLanguageChange('hi')}
                >
                  <Globe className="w-5 h-5 mr-3" />
                  हिंदी (Hindi)
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Dark Mode */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <Moon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm">Dark Mode</p>
                <p className="text-xs text-muted-foreground">
                  {settings.darkMode ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <Switch checked={settings.darkMode} onCheckedChange={toggleDarkMode} />
          </div>

          {/* Notifications */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent/30 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm">Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Period reminders, tips
                </p>
              </div>
            </div>
            <Switch checked={settings.notifications} onCheckedChange={toggleNotifications} />
          </div>

          {/* Motivational Nudges */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm">Motivational Nudges</p>
                <p className="text-xs text-muted-foreground">
                  Daily inspiration messages
                </p>
              </div>
            </div>
            <Switch checked={settings.motivationalNudges} onCheckedChange={toggleMotivationalNudges} />
          </div>

          {/* Wellness Reminders */}
          <Dialog open={remindersDialogOpen} onOpenChange={setRemindersDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm">Wellness Reminders</p>
                    <p className="text-xs text-muted-foreground">
                      Customize daily reminders
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[340px] rounded-3xl">
              <DialogHeader>
                <DialogTitle>Wellness Reminders</DialogTitle>
                <DialogDescription>
                  Choose when you want to receive wellness reminders
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌅</span>
                    <div>
                      <p className="text-sm">Morning</p>
                      <p className="text-xs text-muted-foreground">7 AM - 12 PM</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.wellnessReminders.morning} 
                    onCheckedChange={(checked) => toggleWellnessReminder('morning', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">☀️</span>
                    <div>
                      <p className="text-sm">Afternoon</p>
                      <p className="text-xs text-muted-foreground">1 PM - 6 PM</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.wellnessReminders.afternoon} 
                    onCheckedChange={(checked) => toggleWellnessReminder('afternoon', checked)} 
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌙</span>
                    <div>
                      <p className="text-sm">Evening</p>
                      <p className="text-xs text-muted-foreground">7 PM - 10 PM</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.wellnessReminders.evening} 
                    onCheckedChange={(checked) => toggleWellnessReminder('evening', checked)} 
                  />
                </div>
              </div>
              <Button 
                onClick={() => setRemindersDialogOpen(false)} 
                className="w-full mt-4 rounded-2xl"
              >
                Done
              </Button>
            </DialogContent>
          </Dialog>
        </Card>
      </div>

      {/* Data & Privacy */}
      <div>
        <h3 className="mb-4">Data & Privacy</h3>
        <Card className="rounded-3xl border-none shadow-sm overflow-hidden divide-y divide-border">
          {/* Export Data */}
          <button 
            onClick={handleExportData}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm">Export Data</p>
                <p className="text-xs text-muted-foreground">Download all your data</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Research Consent */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm">Research Consent</p>
                <p className="text-xs text-muted-foreground">
                  Help PCOS research (anonymous)
                </p>
              </div>
            </div>
            <Switch checked={settings.researchConsent} onCheckedChange={toggleResearchConsent} />
          </div>
        </Card>
      </div>

      {/* About */}
      <div>
        <h3 className="mb-4">About</h3>
        <Card className="rounded-3xl border-none shadow-sm overflow-hidden divide-y divide-border">
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <p className="text-sm">Terms of Service</p>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <p className="text-sm">Privacy Policy</p>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <p className="text-sm">About Sakhi</p>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="p-4">
            <p className="text-xs text-muted-foreground text-center">
              Version 1.0.0
            </p>
          </div>
        </Card>
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="w-full p-4 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>

      <div className="h-8" /> {/* Extra spacing */}
      </div>
    </div>
  );
}
