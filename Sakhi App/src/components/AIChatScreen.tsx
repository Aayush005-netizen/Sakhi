import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Send, Mic, Save } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { TopBar } from './TopBar';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Fallback responses if API fails
const fallbackResponses: { [key: string]: string } = {
  'diet': 'For PCOS management, focus on a low-GI diet with plenty of vegetables, lean proteins, and healthy fats. Include foods like leafy greens, berries, nuts, seeds, and whole grains. Avoid refined carbs and sugary foods. 🥗',
  'exercise': 'Regular exercise is crucial! Aim for 150 minutes of moderate activity per week. A mix of cardio (like brisk walking), strength training, and yoga works best for PCOS. Start small and be consistent! 💪',
  'symptoms': 'Common PCOS symptoms include irregular periods, weight gain, acne, and excess hair growth. These can be managed through lifestyle changes, medication, and stress management. Which symptom concerns you most?',
  'weight': 'Weight management with PCOS can be challenging but not impossible! Focus on consistent exercise, balanced meals every 3-4 hours, adequate sleep, and stress management. Small, sustainable changes work best. 🌟',
  'period': 'Period irregularity is common with PCOS. Tracking your cycle helps identify patterns. Regular exercise, maintaining healthy weight, and managing stress can help regulate periods. Consult your doctor if periods are absent for 3+ months.',
  'mood': 'PCOS can affect mood due to hormonal imbalances. Practice stress management through yoga, meditation, adequate sleep (7-8 hours), and talking to supportive people. Don\'t hesitate to seek professional help if needed. 🧘‍♀️',
  'default': 'I understand your concern about PCOS. As your companion, I\'m here to help with diet advice, exercise routines, symptom management, and emotional support. What specific aspect would you like to discuss? 🌸'
};

export function AIChatScreen() {
  const { chatMessages, addChatMessage, toggleSaveMessage } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  // Show welcome message on first visit
  useEffect(() => {
    if (chatMessages.length === 0 && !hasShownWelcome) {
      setHasShownWelcome(true);
      const timer = setTimeout(() => {
        addChatMessage({
          text: "Namaste! 🌸 I'm Sakhi, your PCOS companion powered by Google Gemini AI. I'm here to provide personalized advice about diet, exercise, symptom management, and emotional support. What would you like to know about PCOS today?",
          sender: 'ai'
        });
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFallbackResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    return fallbackResponses.default;
  };

  const getAIResponse = async (userInput: string): Promise<string> => {
    try {
      console.log('Sending message to AI:', userInput);
      console.log('Conversation history length:', chatMessages.length);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-fab45668/ai-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            message: userInput,
            conversationHistory: chatMessages.slice(-10), // Send last 10 messages for context
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('AI API error response:', errorData);
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      console.log('AI response received successfully');
      return data.response;
    } catch (error) {
      console.error('Error calling AI API:', error);
      console.log('Using fallback response for:', userInput);
      // Fallback to keyword-based response
      return getFallbackResponse(userInput);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    addChatMessage({
      text: input,
      sender: 'user'
    });

    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Get AI response from Gemini API
      const response = await getAIResponse(userInput);
      addChatMessage({
        text: response,
        sender: 'ai'
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveMessage = (id: number) => {
    toggleSaveMessage(id);
    const message = chatMessages.find(m => m.id === id);
    if (message?.saved) {
      toast.success('Message removed from saved');
    } else {
      toast.success('Message saved! 🌸');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const text = suggestion.substring(2).trim(); // Remove emoji
    setInput(text);
    // Small delay to ensure input is set before sending
    setTimeout(() => {
      if (text) {
        addChatMessage({
          text,
          sender: 'user'
        });
        setInput('');
        setIsTyping(true);
        
        getAIResponse(text).then(response => {
          addChatMessage({
            text: response,
            sender: 'ai'
          });
        }).catch(error => {
          console.error('Error getting AI response:', error);
          toast.error('Failed to get AI response. Please try again.');
        }).finally(() => {
          setIsTyping(false);
        });
      }
    }, 50);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <TopBar 
        title="Ask Sakhi AI"
        subtitle="Powered by Gemini ✨"
        rightContent={
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
        }
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              {message.sender === 'ai' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                    <span className="text-xs">✨</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Sakhi</span>
                </div>
              )}
              <Card
                className={`p-4 rounded-3xl border shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-primary text-white border-none rounded-tr-md'
                    : 'bg-card border-secondary/30 rounded-tl-md'
                }`}
              >
                <p className={`text-sm leading-relaxed ${
                  message.sender === 'user' ? 'text-white' : 'text-foreground'
                }`}>
                  {message.text}
                </p>
              </Card>
              <div className={`flex items-center gap-2 mt-1 px-2 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                {message.sender === 'ai' && (
                  <button 
                    onClick={() => handleSaveMessage(message.id)}
                    className={`text-xs hover:underline flex items-center gap-1 ${
                      message.saved ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Save className={`w-3 h-3 ${message.saved ? 'fill-current' : ''}`} />
                    {message.saved ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
                <span className="text-xs text-muted-foreground">Sakhi is thinking...</span>
              </div>
              <Card className="p-4 rounded-3xl border border-secondary/30 shadow-sm rounded-tl-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {/* Quick suggestions - show when there are 1 or fewer messages */}
        {chatMessages.length <= 1 && !isTyping && (
          <div className="px-2 mt-4">
            <p className="text-xs text-muted-foreground mb-3 px-2">Quick questions to get started:</p>
            <div className="flex flex-wrap gap-2">
              {[
                '🥗 Indian PCOS diet',
                '💪 Best exercises',
                '🧘‍♀️ Yoga for PCOS',
                '⏰ Period tracking tips',
                '😌 Managing stress',
                '💊 Common medications'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="px-6 py-4 border-t border-border mb-20">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
              placeholder="Ask me anything about PCOS..."
              className="rounded-full bg-input-background border-none h-12 pr-12"
              disabled={isTyping}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              disabled={isTyping}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
