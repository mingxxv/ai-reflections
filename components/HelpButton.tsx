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
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
          <div className="absolute right-0 top-10 z-20 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                Writing suggestions
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
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
                  className="w-full p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-gray-700">{suggestion}</span>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      Insert →
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            {suggestions.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Keep writing to get more suggestions!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
