'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { JournalPurpose } from '@/lib/promptPolicy';

interface JournalEntry {
  id: string;
  date: string;
  purpose: JournalPurpose;
  role: string;
  title: string;
  content: string;
  promptsShown: string[];
}

export default function ViewEntryPage() {
  const router = useRouter();
  const params = useParams();
  const entryId = params.id as string;
  
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntry();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId]);

  const loadEntry = () => {
    try {
      const savedEntries = localStorage.getItem('journal:entries');
      if (!savedEntries) {
        setError('No journal entries found');
        setLoading(false);
        return;
      }

      const entries: JournalEntry[] = JSON.parse(savedEntries);
      const foundEntry = entries.find(e => e.id === entryId);
      
      if (!foundEntry) {
        setError('Journal entry not found');
      } else {
        setEntry(foundEntry);
      }
    } catch (error) {
      console.error('Failed to load entry:', error);
      setError('Failed to load journal entry');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPurposeLabel = (purpose: JournalPurpose) => {
    switch (purpose) {
      case 'daily-reflection': return 'Daily Reflection';
      case 'event-reflection': return 'Event Reflection';
      case 'reading-resource': return 'Reading Resource';
      default: return purpose;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading journal entry...</p>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-red-500 dark:text-red-400">⚠️</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {error || 'Entry not found'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                The journal entry you&apos;re looking for doesn&apos;t exist or has been deleted.
              </p>
            </div>
            <button
              onClick={() => router.push('/journal/history')}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              Back to History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/journal/history')}
            className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to History
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {entry.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{formatDate(entry.date)}</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full">
                  {getPurposeLabel(entry.purpose)}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full capitalize">
                  {entry.role} level
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                {entry.content}
              </div>
            </div>
          </div>
        </div>

        {/* Prompts Section (if any were shown) */}
        {entry.promptsShown && entry.promptsShown.length > 0 && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-3">
              Prompts used in this entry
            </h3>
            <div className="space-y-2">
              {entry.promptsShown.map((prompt, index) => (
                <div key={index} className="text-sm text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/40 rounded px-3 py-2">
                  {prompt}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push('/journal')}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          >
            New Entry
          </button>
          <button
            onClick={() => router.push('/journal/history')}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors"
          >
            View All Entries
          </button>
        </div>
      </div>
    </div>
  );
}
