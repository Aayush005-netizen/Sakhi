import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-fab45668/health", (c) => {
  return c.json({ status: "ok" });
});

// Gemini AI chat endpoint
app.post("/make-server-fab45668/ai-chat", async (c) => {
  try {
    const { message, conversationHistory } = await c.req.json();
    
    if (!message || typeof message !== 'string') {
      return c.json({ error: 'Message is required' }, 400);
    }

    // Get Gemini API key from environment
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.log('GEMINI_API_KEY environment variable is not set');
      return c.json({ error: 'AI service not configured. Please add your Gemini API key.' }, 500);
    }

    // System instruction for PCOS companion
    const systemInstruction = `You are Sakhi, a compassionate AI companion specializing in PCOS (Polycystic Ovary Syndrome) support for Indian women. Your role is to:

1. Provide evidence-based information about PCOS management
2. Offer emotional support and encouragement
3. Suggest lifestyle modifications including diet (considering Indian cuisine), exercise, and stress management
4. Help track symptoms and identify patterns
5. Encourage professional medical consultation when appropriate

Guidelines:
- Be warm, empathetic, and culturally sensitive to Indian context
- Use simple, clear language
- Include relevant emojis occasionally (🌸, 💪, 🥗, etc.)
- Never provide diagnosis or replace professional medical advice
- Suggest Indian-friendly foods when discussing diet
- Keep responses concise (2-4 sentences usually)
- Be encouraging and positive while being realistic`;

    // Prepare conversation context
    const contents = [];
    
    // Add conversation history if available (exclude welcome message)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const relevantHistory = conversationHistory.filter(msg => 
        msg.sender === 'user' || (msg.sender === 'ai' && !msg.text.includes('Namaste! 🌸'))
      ).slice(-6); // Last 6 messages for context
      
      for (const msg of relevantHistory) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`Gemini API error (${response.status}): ${errorData}`);
      
      // Try to parse error for more details
      try {
        const errorJson = JSON.parse(errorData);
        console.log('Gemini API detailed error:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        // Error is not JSON
      }
      
      return c.json({ 
        error: 'Failed to get AI response. Please check API key and try again.',
        details: response.status === 400 ? 'Invalid request format' : undefined
      }, 500);
    }

    const data = await response.json();
    console.log('Gemini API response received:', data?.candidates?.[0]?.finishReason || 'success');
    
    // Extract response text
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      console.log('No response text from Gemini API. Full response:', JSON.stringify(data, null, 2));
      
      // Check if content was blocked
      if (data?.candidates?.[0]?.finishReason === 'SAFETY') {
        return c.json({ error: 'Response was filtered for safety. Please rephrase your question.' }, 500);
      }
      
      return c.json({ error: 'No response from AI service. Please try again.' }, 500);
    }

    return c.json({ response: aiResponse });
    
  } catch (error) {
    console.log(`Error in AI chat endpoint: ${error.message || error}`);
    return c.json({ error: 'An error occurred while processing your request' }, 500);
  }
});

Deno.serve(app.fetch);