export type FrequencyRole = 'beginner' | 'amateur' | 'pro';
export type JournalPurpose = 'daily-reflection' | 'event-reflection' | 'reading-resource';

export interface Prompt {
  id: string;
  text: string;
  difficulty: 'easy' | 'challenging';
}

// Fallback prompts data (will be used if file loading fails or on client-side)
const FALLBACK_PROMPTS: Record<FrequencyRole, Prompt[]> = {
  beginner: [
    { id: 'beginner_1', text: 'What did you do today?', difficulty: 'easy' },
    { id: 'beginner_2', text: 'How did you feel about your interactions with others today?', difficulty: 'challenging' }
  ],
  amateur: [
    { id: 'amateur_1', text: 'What was the most meaningful moment of your day?', difficulty: 'easy' },
    { id: 'amateur_2', text: 'What pattern do you notice in your thoughts today?', difficulty: 'easy' },
    { id: 'amateur_3', text: 'How did you grow or learn something new?', difficulty: 'easy' }
  ],
  pro: [
    { id: 'pro_1', text: "What deeper insight emerged from today's experiences?", difficulty: 'challenging' },
    { id: 'pro_2', text: 'How does today connect to your larger life narrative?', difficulty: 'challenging' }
  ]
};

// Cache for prompts to avoid re-reading files
let cachedPrompts: Record<FrequencyRole, Prompt[]> | null = null;

/**
 * Get prompts based on role and purpose
 *
 * Loads prompts from content files on server-side. Falls back to hardcoded data on client-side.
 * When backend is ready, update to fetch from API endpoints.
 */
export function getPromptsForRole(role: FrequencyRole): Prompt[] {
  if (!cachedPrompts) {
    cachedPrompts = loadPromptsSync();
  }

  return cachedPrompts[role] || FALLBACK_PROMPTS[role] || [];
}

/**
 * Synchronous wrapper for loading prompts from markdown
 * This reads from content/journal/prompts.md
 *
 * Migration: Replace this with an API call when backend is ready
 */
function loadPromptsSync(): Record<FrequencyRole, Prompt[]> {
  // Check if we're running on the server (where fs is available)
  if (typeof window !== 'undefined') {
    // Client-side: return fallback data
    return FALLBACK_PROMPTS;
  }

  try {
    // Server-side only: dynamic imports for Node.js modules
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    const contentPath = path.join(process.cwd(), 'content', 'journal', 'prompts.md');
    const content = fs.readFileSync(contentPath, 'utf-8');

    const prompts: Record<FrequencyRole, Prompt[]> = {
      beginner: [],
      amateur: [],
      pro: []
    };

    const lines = content.split('\n');
    let currentRole: FrequencyRole | null = null;
    let currentPrompt: Partial<Prompt> = {};
    let currentId = '';

    for (const line of lines) {
      if (line.startsWith('## ') && line.includes('Prompts')) {
        const roleMatch = line.match(/## (\w+) Prompts/);
        if (roleMatch) {
          currentRole = roleMatch[1].toLowerCase() as FrequencyRole;
        }
      } else if (line.startsWith('### ') && currentRole) {
        if (currentId && Object.keys(currentPrompt).length > 0) {
          prompts[currentRole].push(currentPrompt as Prompt);
        }
        currentId = line.replace('### ', '').trim();
        currentPrompt = { id: currentId };
      } else if (line.startsWith('- **') && currentRole) {
        const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
        if (match) {
          const [, key, value] = match;
          const promptRecord = currentPrompt as Record<string, string | 'easy' | 'challenging'>;
          if (key === 'difficulty') {
            promptRecord[key] = value as 'easy' | 'challenging';
          } else {
            promptRecord[key] = value;
          }
        }
      }
    }

    // Add last prompt
    if (currentRole && currentId && Object.keys(currentPrompt).length > 0) {
      prompts[currentRole].push(currentPrompt as Prompt);
    }

    return prompts;
  } catch (error) {
    console.error('Error loading prompts:', error);
    return FALLBACK_PROMPTS;
  }
}

// Fallback suggestions data
const FALLBACK_SUGGESTIONS = {
  short: ['Try writing about specific details from your day', 'What emotions did you experience?'],
  medium: ['Consider the impact this had on you', 'What would you do differently next time?'],
  long: ['What insights can you draw from this experience?', 'How does this relate to your goals?'],
  role: {
    beginner: 'Remember: there are no wrong answers in journaling',
    amateur: 'Consider the broader context of this experience',
    pro: 'What deeper patterns or themes do you see?'
  }
};

// Cache for suggestions
let cachedSuggestions: { short: string[]; medium: string[]; long: string[]; role: Record<FrequencyRole, string> } | null = null;

/**
 * Generate contextual suggestions based on current content and role
 *
 * Loads suggestions from content files on server-side. Falls back to hardcoded data on client-side.
 * When backend is ready, update to fetch from API endpoints.
 */
export function generateSuggestions(content: string, role: FrequencyRole): string[] {
  if (!cachedSuggestions) {
    cachedSuggestions = loadSuggestionsSync();
  }

  const suggestions: string[] = [];

  // Add length-based suggestions
  if (content.length < 50) {
    suggestions.push(...cachedSuggestions.short);
  } else if (content.length < 150) {
    suggestions.push(...cachedSuggestions.medium);
  } else {
    suggestions.push(...cachedSuggestions.long);
  }

  // Add role-specific suggestion
  if (cachedSuggestions.role[role]) {
    suggestions.push(cachedSuggestions.role[role]);
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
}

/**
 * Synchronous wrapper for loading suggestions from markdown
 * This reads from content/journal/suggestions.md
 *
 * Migration: Replace this with an API call when backend is ready
 */
function loadSuggestionsSync(): { short: string[]; medium: string[]; long: string[]; role: Record<FrequencyRole, string> } {
  // Check if we're running on the server (where fs is available)
  if (typeof window !== 'undefined') {
    // Client-side: return fallback data
    return FALLBACK_SUGGESTIONS;
  }

  try {
    // Server-side only: dynamic imports for Node.js modules
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    const contentPath = path.join(process.cwd(), 'content', 'journal', 'suggestions.md');
    const content = fs.readFileSync(contentPath, 'utf-8');

    const result = {
      short: [] as string[],
      medium: [] as string[],
      long: [] as string[],
      role: {} as Record<FrequencyRole, string>
    };

    const lines = content.split('\n');
    let currentContext: 'short' | 'medium' | 'long' | 'role' | null = null;
    let currentRole: FrequencyRole | null = null;

    for (const line of lines) {
      if (line.includes('Short')) {
        currentContext = 'short';
      } else if (line.includes('Medium')) {
        currentContext = 'medium';
      } else if (line.includes('Long')) {
        currentContext = 'long';
      } else if (line.includes('Role-Specific')) {
        currentContext = 'role';
      } else if (line.startsWith('### ') && currentContext === 'role') {
        const roleMatch = line.match(/### (\w+)/);
        if (roleMatch) {
          currentRole = roleMatch[1].toLowerCase() as FrequencyRole;
        }
      } else if (line.startsWith('- ') && currentContext) {
        const text = line.replace('- ', '').trim();
        if (currentContext === 'role' && currentRole) {
          result.role[currentRole] = text;
        } else if (currentContext !== 'role') {
          result[currentContext].push(text);
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error loading suggestions:', error);
    return FALLBACK_SUGGESTIONS;
  }
}

/**
 * Map frequency selection to role
 */
export function mapFrequencyToRole(frequency: string): FrequencyRole {
  switch (frequency) {
    case 'once-a-week':
      return 'beginner';
    case 'every-2-days':
      return 'amateur';
    case 'everyday':
      return 'pro';
    default:
      return 'beginner';
  }
}
