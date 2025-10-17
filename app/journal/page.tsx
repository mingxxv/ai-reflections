'use client';

import { useState, useEffect } from 'react';
import AIChatModal from '@/components/AIChatModal';

interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
}

export default function JournalPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [savedEntryForAI, setSavedEntryForAI] = useState<{ title?: string; content: string } | null>(null);

  // Load recent entries on mount
  useEffect(() => {
    fetchRecentEntries();
  }, []);

  // Auto-save draft to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trim()) {
        localStorage.setItem('journal:draft', JSON.stringify({ title, content }));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('journal:draft');
    if (draft) {
      try {
        const { title: savedTitle, content: savedContent } = JSON.parse(draft);
        setTitle(savedTitle || '');
        setContent(savedContent || '');
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  async function fetchRecentEntries() {
    try {
      setIsLoadingEntries(true);
      const response = await fetch('/api/journal');

      if (response.ok) {
        const data = await response.json();
        setRecentEntries(data.journals.slice(0, 5)); // Get 5 most recent
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setIsLoadingEntries(false);
    }
  }

  async function handleSave() {
    if (!content.trim() || content.trim().length < 10) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim(),
        }),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTitle('');
        setContent('');
        localStorage.removeItem('journal:draft');

        // Refresh recent entries
        await fetchRecentEntries();

        // Reset success message after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Failed to save journal:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAIChat() {
    if (!content.trim() || content.trim().length < 10) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Save the journal entry first
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim(),
        }),
      });

      if (response.ok) {
        // Store the saved entry for AI chat
        setSavedEntryForAI({
          title: title.trim() || undefined,
          content: content.trim(),
        });

        // Clear form
        setTitle('');
        setContent('');
        localStorage.removeItem('journal:draft');

        // Refresh recent entries
        await fetchRecentEntries();

        // Open AI chat modal
        setIsAIChatOpen(true);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Failed to save journal:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Journal Editor */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      Journal
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      Write your thoughts and reflections
                    </p>
                  </div>
                </div>
              </div>

              {/* Journal Form */}
              <div className="p-6 space-y-6">
                {/* Title Input (Optional) */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Title <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your entry a title..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>

                {/* Content Textarea */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Reflection
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your thoughts and feelings..."
                    rows={16}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-vertical transition"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {content.length} characters • Minimum 10 characters
                    </p>
                    {content.trim() && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Auto-saved to draft
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Messages */}
                {saveStatus === 'success' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      Journal entry saved successfully!
                    </p>
                  </div>
                )}

                {saveStatus === 'error' && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-red-800 dark:text-red-300 font-medium">
                      Please write at least 10 characters before saving
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleAIChat}
                    disabled={isSaving || content.trim().length < 10}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Chat with AI
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || content.trim().length < 10}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Entry'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Entries Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden sticky top-8">
              <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Entries
                </h2>
              </div>

              <div className="p-4 max-h-[600px] overflow-y-auto">
                {isLoadingEntries ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : recentEntries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No entries yet</p>
                    <p className="text-xs mt-1">Start writing to see your entries here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition cursor-pointer"
                      >
                        {entry.title && (
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
                            {entry.title}
                          </h3>
                        )}
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {entry.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {savedEntryForAI && (
        <AIChatModal
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
          journalEntry={savedEntryForAI}
        />
      )}
    </main>
  );
}
