import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * MOCK AI CHAT API - Context-Aware Reflection Assistant
 *
 * This is a temporary mock implementation that returns simulated AI responses
 * with awareness of journal entries and conversation history.
 *
 * TODO - FUTURE INTEGRATION:
 * Replace this mock with a real AI integration:
 *
 * 1. AI Provider Options:
 *    - OpenAI GPT-4 / ChatGPT API
 *    - Anthropic Claude API
 *    - Google Gemini API
 *    - Local LLM (Ollama, LM Studio)
 *
 * 2. Implementation Example (OpenAI with Context):
 *    ```typescript
 *    import OpenAI from 'openai';
 *
 *    const openai = new OpenAI({
 *      apiKey: process.env.OPENAI_API_KEY,
 *    });
 *
 *    // Build context from journal entries
 *    const journalContext = await fetchRecentJournals(userId, 5);
 *    const systemPrompt = `You are a thoughtful reflection assistant...
 *      Recent journal context: ${JSON.stringify(journalContext)}`;
 *
 *    const completion = await openai.chat.completions.create({
 *      model: "gpt-4",
 *      messages: [
 *        { role: "system", content: systemPrompt },
 *        ...conversationHistory,
 *        { role: "user", content: userMessage }
 *      ],
 *      temperature: 0.7, // Adjust for more/less creative responses
 *    });
 *    ```
 *
 * 3. Context-Aware Features:
 *    - Load user's recent journal entries (last 5-10)
 *    - Analyze patterns in user's writing
 *    - Reference previous conversations
 *    - Remember user preferences and goals
 *    - Track emotional patterns over time
 *
 * 4. Additional Considerations:
 *    - Add rate limiting per user
 *    - Implement conversation memory with vector DB (Pinecone, Weaviate)
 *    - Add streaming responses for better UX
 *    - Store conversations in database with user ID
 *    - Add cost tracking for API usage per user
 *    - Implement safety filters/moderation
 *    - Add user authentication/session management
 */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  journalEntry?: {
    title?: string;
    content: string;
  };
  conversationHistory?: ChatMessage[];
  loadJournalContext?: boolean; // Whether to fetch recent journals
}

// Mock AI responses based on common journal reflection patterns
const mockResponses = [
  "That's a really thoughtful reflection. What emotions came up for you as you were writing this?",
  "I can sense the depth in what you've shared. How do you think this experience has shaped your perspective?",
  "Thank you for being so open. What would you say is the most important insight you've gained from this?",
  "It sounds like this is something significant for you. Would you like to explore any particular aspect more deeply?",
  "I appreciate you sharing this. How do you feel about taking action on these thoughts?",
  "That's an interesting observation. What do you think might be driving these feelings?",
  "It's clear you've given this a lot of thought. What support or resources do you think would be most helpful right now?",
  "I hear you. Sometimes just writing things out can bring clarity. What patterns do you notice in your reflections?",
];

// Fetch recent journal entries for context
async function fetchRecentJournals(limit: number = 5) {
  try {
    const journalsPath = path.join(process.cwd(), 'data', 'journals.json');
    const data = await fs.readFile(journalsPath, 'utf-8');
    const journals = JSON.parse(data);

    // Return most recent entries
    return journals
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch {
    return [];
  }
}

// Generate contextual mock response with journal awareness
function generateMockResponse(
  userMessage: string,
  journalContext: any[] = [],
  conversationHistory: ChatMessage[] = []
): string {
  const lowerMessage = userMessage.toLowerCase();

  // Reference journal context if available
  if (journalContext.length > 0 && (lowerMessage.includes('journal') || lowerMessage.includes('wrote') || lowerMessage.includes('entry'))) {
    const recentTopics = journalContext.slice(0, 3).map(j => j.title || j.content.substring(0, 50)).join(', ');
    return `I've been reflecting on your recent journal entries about ${recentTopics}. I notice some themes emerging. What patterns are you seeing in your own reflections?`;
  }

  // Pattern-based responses
  if (lowerMessage.includes('why') || lowerMessage.includes('how come')) {
    return "That's a profound question. From what you've shared in your reflections, it seems like you're exploring some deeper motivations. What do you think might be at the root of this?";
  }

  if (lowerMessage.includes('feel') || lowerMessage.includes('emotion')) {
    return "Emotions are such important guides. In your recent writings, I noticed themes that suggest you're processing something meaningful. Can you tell me more about what feelings are strongest for you right now?";
  }

  if (lowerMessage.includes('what should') || lowerMessage.includes('what do i')) {
    return "It sounds like you're looking for direction. Based on your reflections, what feels most aligned with your values? Sometimes our journal entries reveal insights we didn't consciously realize.";
  }

  if (lowerMessage.includes('thank') || lowerMessage.includes('appreciate')) {
    return "You're very welcome. I'm here to help you explore your thoughts. Is there anything from your recent reflections you'd like to discuss further?";
  }

  if (lowerMessage.includes('struggle') || lowerMessage.includes('difficult') || lowerMessage.includes('hard')) {
    return "I hear that you're finding this challenging. Your willingness to reflect on difficult experiences shows real strength. What small step do you think might help you move forward?";
  }

  if (lowerMessage.includes('pattern') || lowerMessage.includes('notice')) {
    return "Recognizing patterns is such an important part of self-awareness. Looking at your journal history, what themes or emotions keep showing up? What might they be trying to tell you?";
  }

  // First message - welcoming
  if (conversationHistory.length <= 1) {
    return "Hello! I'm here to support you in your reflection journey. I've been following your journal entries and I'm curious - what's on your mind today? Is there something specific from your recent reflections you'd like to explore?";
  }

  // Default to random thoughtful response
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, journalEntry, conversationHistory = [], loadJournalContext = false } = body;

    // Validation
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Fetch journal context if requested
    let journalContext: any[] = [];
    if (loadJournalContext) {
      journalContext = await fetchRecentJournals(5);
    }

    // Simulate AI processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate mock response with context awareness
    const aiResponse = generateMockResponse(
      message,
      journalContext,
      conversationHistory
    );

    // Return response with context metadata
    return NextResponse.json({
      message: aiResponse,
      timestamp: new Date().toISOString(),
      contextUsed: journalContext.length > 0,
      journalEntriesReferenced: journalContext.length,
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
