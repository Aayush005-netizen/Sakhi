import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

const plans = [
  {
    id: 'free',
    name: 'Free',
    icon: '🌸',
    price: '₹0',
    period: 'forever',
    features: [
      'Basic cycle tracking',
      'Mood logging',
      'Limited AI queries (5/month)',
      'Community access',
      'Educational content'
    ],
    highlighted: false
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: '✨',
    price: '₹299',
    period: 'per month',
    features: [
      'Everything in Free',
      'Unlimited AI consultations',
      'Personalized diet plans',
      'Custom workout routines',
      'Advanced analytics',
      'Report analysis',
      'Priority support',
      'Export all data'
    ],
    highlighted: true,
    badge: 'Most Popular'
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: '👑',
    price: '₹2,999',
    period: 'per year',
    features: [
      'Everything in Pro',
      'Monthly doctor consultations',
      'Personalized supplements',
      'Advanced lab analysis',
      'Research participation',
      'Exclusive webinars',
      'Dedicated health coach',
      '2 months free'
    ],
    highlighted: false,
    badge: 'Best Value'
  }
];

export function SubscriptionScreen() {
  const { subscriptionTier, setSubscriptionTier } = useApp();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') {
      toast.info('You are currently on the free plan');
      return;
    }
    if (planId === subscriptionTier) {
      toast.info('You are already subscribed to this plan');
      return;
    }
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setSubscriptionTier(selectedPlan as 'free' | 'pro' | 'premium');
      setShowPayment(false);
      toast.success(`Successfully subscribed to ${selectedPlan} plan! 🎉`);
    }, 1500);
  };

  return (
    <div className="pb-24 px-6 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2>Choose Your Plan</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Upgrade for unlimited AI access and personalized care
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`p-6 rounded-3xl border-2 shadow-lg transition-all ${
              plan.highlighted
                ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5 scale-[1.02]'
                : 'border-border'
            }`}
          >
            {plan.badge && (
              <div className="mb-4">
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary text-white">
                  <Sparkles className="w-3 h-3" />
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{plan.icon}</div>
                <div>
                  <h3>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl text-primary">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleSubscribe(plan.id)}
              disabled={subscriptionTier === plan.id}
              className={`w-full rounded-2xl h-12 ${
                plan.highlighted
                  ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {subscriptionTier === plan.id ? 'Current Plan' : 'Subscribe Now'}
            </Button>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="space-y-3 pt-4">
        <h3 className="text-center mb-4">Why upgrade?</h3>
        
        <Card className="p-4 rounded-2xl border-none shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4>Unlimited AI Support</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Get instant answers to all your PCOS questions, anytime
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border-none shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h4>Personalized Plans</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Custom diet and workout plans tailored to your body
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border-none shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h4>Expert Guidance</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Access to healthcare professionals and health coaches
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="rounded-3xl max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="text-center p-6 bg-muted/30 rounded-2xl">
              <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
              <h2 className="text-primary">
                {selectedPlan === 'pro' ? '₹299' : '₹2,999'}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedPlan === 'pro' ? 'Billed monthly' : 'Billed annually'}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm">Payment Method</p>
              <button className="w-full p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  💳
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm">Credit/Debit Card</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                </div>
              </button>
              <button className="w-full p-4 rounded-2xl border-2 border-border hover:border-primary transition-colors flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                  📱
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm">UPI</p>
                  <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                </div>
              </button>
            </div>

            <Button 
              onClick={handlePayment}
              className="w-full rounded-2xl bg-primary hover:bg-primary/90 h-12 mt-4"
            >
              Proceed to Pay
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secured by Razorpay • Your data is encrypted
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Money Back Guarantee */}
      <Card className="p-5 rounded-3xl border-none bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="text-center">
          <div className="text-4xl mb-3">💚</div>
          <h4 className="mb-2">7-Day Money Back Guarantee</h4>
          <p className="text-sm text-muted-foreground">
            Not satisfied? Get a full refund within 7 days, no questions asked.
          </p>
        </div>
      </Card>
    </div>
  );
}
