import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface AuthScreenProps {
  onComplete: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot';

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const { setUser } = useApp();
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (view === 'forgot') {
      toast.success('Password reset link sent to your email!');
      setView('login');
      setIsLoading(false);
      return;
    }

    if (view === 'signup') {
      // Create new user
      setUser({
        name: name,
        email: email,
        joinDate: new Date().toISOString(),
      });
      toast.success(`Welcome to Sakhi, ${name}! 🌸`);
    } else {
      // Login existing user
      setUser({
        name: email.split('@')[0],
        email: email,
        joinDate: new Date().toISOString(),
      });
      toast.success('Welcome back! 🌸');
    }

    setIsLoading(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-background overflow-y-auto">
      <div className="min-h-full flex flex-col p-6">
        {/* Logo */}
        <div className="text-center pt-8 pb-12">
          <div className="text-6xl mb-4">🌸</div>
          <h1>Sakhi</h1>
          <p className="text-muted-foreground">Your PCOS Companion</p>
        </div>

        {/* Auth Form */}
        <Card className="p-6 rounded-3xl border-none shadow-lg">
          <h2 className="mb-6 text-center">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'forgot' && 'Reset Password'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl bg-input-background border-none h-12"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl bg-input-background border-none h-12"
                required
              />
            </div>

            {view !== 'forgot' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl bg-input-background border-none h-12"
                  required
                />
              </div>
            )}

            {view === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full rounded-2xl bg-primary hover:bg-primary/90 h-12 mt-6"
            >
              {isLoading ? 'Please wait...' : (
                <>
                  {view === 'login' && 'Login'}
                  {view === 'signup' && 'Sign Up'}
                  {view === 'forgot' && 'Send Reset Link'}
                </>
              )}
            </Button>

            {view !== 'forgot' && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setUser({
                    name: 'Guest',
                    email: 'guest@sakhi.app',
                    joinDate: new Date().toISOString(),
                  });
                  toast.success('Welcome! Explore Sakhi as a guest 🌸');
                  onComplete();
                }}
                className="w-full rounded-2xl h-12"
              >
                Continue as Guest
              </Button>
            )}
          </form>

          <div className="mt-6 text-center">
            {view === 'login' && (
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => setView('signup')}
                  className="text-primary hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
            {(view === 'signup' || view === 'forgot') && (
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => setView('login')}
                  className="text-primary hover:underline"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </Card>

        {/* Privacy Notice */}
        <p className="text-xs text-center text-muted-foreground mt-8 px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy. 
          Your data is encrypted and secure.
        </p>
      </div>
    </div>
  );
}
