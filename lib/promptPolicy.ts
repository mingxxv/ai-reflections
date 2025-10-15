export type FrequencyRole = 'beginner' | 'amateur' | 'pro';
export type JournalPurpose = 'daily-reflection' | 'event-reflection' | 'reading-resource';

export interface Prompt {
  id: string;
  text: string;
  difficulty: 'easy' | 'challenging';
}

/**
 * Get prompts based on role and purpose
 */
export function getPromptsForRole(role: FrequencyRole): Prompt[] {
  const prompts: Record<FrequencyRole, Prompt[]> = {
    beginner: [
      {
        id: 'beginner_1',
        text: 'What did you do today?',
        difficulty: 'easy'
      },
      {
        id: 'beginner_2',
        text: 'How did you feel about your interactions with others today?',
        difficulty: 'challenging'
      }
    ],
    amateur: [
      {
        id: 'amateur_1',
        text: 'What was the most meaningful moment of your day?',
        difficulty: 'easy'
      },
      {
        id: 'amateur_2',
        text: 'What pattern do you notice in your thoughts today?',
        difficulty: 'easy'
      },
      {
        id: 'amateur_3',
        text: 'How did you grow or learn something new?',
        difficulty: 'easy'
      }
    ],
    pro: [
      {
        id: 'pro_1',
        text: 'What deeper insight emerged from today\'s experiences?',
        difficulty: 'challenging'
      },
      {
        id: 'pro_2',
        text: 'How does today connect to your larger life narrative?',
        difficulty: 'challenging'
      }
    ]
  };

  return prompts[role] || [];
}

/**
 * Generate contextual suggestions based on current content and role
 */
export function generateSuggestions(content: string, role: FrequencyRole): string[] {
  const suggestions: string[] = [];
  
  if (content.length < 50) {
    suggestions.push('Try writing about specific details from your day');
    suggestions.push('What emotions did you experience?');
  } else if (content.length < 150) {
    suggestions.push('Consider the impact this had on you');
    suggestions.push('What would you do differently next time?');
  } else {
    suggestions.push('What insights can you draw from this experience?');
    suggestions.push('How does this relate to your goals?');
  }

  // Add role-specific suggestions
  if (role === 'beginner') {
    suggestions.push('Remember: there are no wrong answers in journaling');
  } else if (role === 'amateur') {
    suggestions.push('Consider the broader context of this experience');
  } else {
    suggestions.push('What deeper patterns or themes do you see?');
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
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
