'use client';

import { useState, useEffect, useCallback } from 'react';
import { JournalPurpose, FrequencyRole } from '@/lib/promptPolicy';
import { getTodayString, generateEntryId } from '@/lib/date';

interface JournalEditorProps {
  purpose: JournalPurpose;
  role: FrequencyRole;
  onSave: (entryId: string) => void;
  onContentChange?: (content: string) => void;
  onInsertSuggestion?: (suggestion: string) => void;
}

interface DraftData {
  title: string;
  content: string;
}

export default function JournalEditor({ purpose, role, onSave, onContentChange, onInsertSuggestion }: JournalEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{title?: string; content?: string}>({});
  const today = getTodayString();

  // Load draft from localStorage on mount
  useEffect(() => {
    const draftKey = `journal:draft:${purpose}:${today}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const draft: DraftData = JSON.parse(savedDraft);
        setTitle(draft.title || '');
        setContent(draft.content || '');
      } catch (error) {
        console.error('Failed to parse draft:', error);
      }
    }
  }, [purpose, today]);

  // Debounced autosave
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((title: string, content: string) => {
      const draftKey = `journal:draft:${purpose}:${today}`;
      const draft: DraftData = { title, content };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }, 1000),
    [purpose, today]
  );

  // Auto-save on title/content change
  useEffect(() => {
    debouncedSave(title, content);
    onContentChange?.(content);
  }, [title, content, debouncedSave, onContentChange]);

  // Handle external suggestion insertion
  useEffect(() => {
    if (onInsertSuggestion) {
      const handleInsert = (event: CustomEvent<string>) => {
        setContent(prev => prev + (prev ? '\n\n' : '') + event.detail);
      };
      
      window.addEventListener('insert-suggestion' as unknown as keyof WindowEventMap, handleInsert as EventListener);
      return () => window.removeEventListener('insert-suggestion' as unknown as keyof WindowEventMap, handleInsert as EventListener);
    }
  }, [onInsertSuggestion]);

  const validateForm = (): boolean => {
    const newErrors: {title?: string; content?: string} = {};
    
    if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // Get existing entries or create new array
      const entriesKey = 'journal:entries';
      const existingEntries = JSON.parse(localStorage.getItem(entriesKey) || '[]');
      
      // Create new entry
      const entryId = generateEntryId();
      const newEntry = {
        id: entryId,
        date: today,
        purpose,
        role,
        title,
        content,
        promptsShown: [] // TODO: Track which prompts were shown
      };
      
      // Add to entries
      existingEntries.push(newEntry);
      localStorage.setItem(entriesKey, JSON.stringify(existingEntries));
      
      // Clear draft
      const draftKey = `journal:draft:${purpose}:${today}`;
      localStorage.removeItem(draftKey);
      
      // Reset form
      setTitle('');
      setContent('');
      setErrors({});
      
      // Show success message and redirect
      alert('Entry saved successfully!');
      onSave(entryId);
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Remove the old handleInsertSuggestion function since we're using the new approach

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Journal Entry
          </h1>
          <div className="text-sm text-gray-500">
            {today}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's this entry about?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Content Textarea */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Your thoughts
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts..."
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving || title.length < 3 || content.length < 20}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple debounce function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
