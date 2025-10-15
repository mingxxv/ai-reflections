'use client';

import { useState } from 'react';
import { FrequencyRole, generateSuggestions } from '@/lib/promptPolicy';

interface HelpButtonProps {
  role: FrequencyRole;
  currentContent: string;
  onInsertSuggestion: (suggestion: string) => void;
}

export default function HelpButton({ role, currentContent, onInsertSuggestion }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleHelpClick = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      const newSuggestions = generateSuggestions(currentContent, role);
      setSuggestions(newSuggestions);
      setIsOpen(true);
    }
  };

  const handleInsertSuggestion = (suggestion: string) => {
    onInsertSuggestion(suggestion);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleHelpClick}
        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
        aria-label="Get writing suggestions"
      >
        <span className="text-lg font-bold">?</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Suggestions Panel */}
          <div className="absolute right-0 top-10 z-20 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Writing suggestions
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                aria-label="Close suggestions"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleInsertSuggestion(suggestion)}
                  className="w-full p-3 text-left text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                      Insert →
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {suggestions.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Keep writing to get more suggestions!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
