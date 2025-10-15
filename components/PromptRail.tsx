'use client';

import { FrequencyRole, JournalPurpose, getPromptsForRole, Prompt } from '@/lib/promptPolicy';

interface PromptRailProps {
  role: FrequencyRole;
  purpose: JournalPurpose;
  onPromptClick?: (prompt: Prompt) => void;
}

export default function PromptRail({ role, onPromptClick }: PromptRailProps) {
  const prompts = getPromptsForRole(role);

  if (prompts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Suggested prompts
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {role} level
          </div>
        </div>

        <div className={`grid gap-3 ${
          role === 'pro' ? 'grid-cols-2' :
          role === 'amateur' ? 'grid-cols-3' :
          'grid-cols-2'
        }`}>
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => onPromptClick?.(prompt)}
              className={`p-3 rounded-lg border text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                prompt.difficulty === 'challenging'
                  ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-800 dark:text-red-300'
                  : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-800 dark:text-green-300'
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {prompt.difficulty === 'challenging' ? '💪' : '😊'}
                {prompt.difficulty === 'challenging' ? ' Challenging' : ' Easy'}
              </div>
              <div className="text-sm">
                {prompt.text}
              </div>
            </button>
          ))}
        </div>

        {role === 'amateur' && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              Choose prompts that feel right for you today
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
