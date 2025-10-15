'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function HistoryPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPurpose, setFilterPurpose] = useState<JournalPurpose | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, searchTerm, filterPurpose]);

  const loadEntries = () => {
    try {
      const savedEntries = localStorage.getItem('journal:entries');
      if (savedEntries) {
        const parsedEntries: JournalEntry[] = JSON.parse(savedEntries);
        // Sort by date (newest first)
        const sortedEntries = parsedEntries.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEntries(sortedEntries);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    // Filter by purpose
    if (filterPurpose !== 'all') {
      filtered = filtered.filter(entry => entry.purpose === filterPurpose);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(term) ||
        entry.content.toLowerCase().includes(term)
      );
    }

    setFilteredEntries(filtered);
  };

  const handleEntryClick = (entryId: string) => {
    router.push(`/journal/view/${entryId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getContentPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
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
          <p className="text-gray-600 dark:text-gray-400">Loading your journal entries...</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-gray-400 dark:text-gray-500">📝</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No journal entries yet
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start your journaling journey by creating your first reflection.
              </p>
            </div>
            <button
              onClick={() => router.push('/journal')}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              Start a New Reflection
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Journal History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredEntries.length} of {entries.length} entries
              </p>
            </div>
            <button
              onClick={() => router.push('/journal')}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            >
              New Entry
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value as JournalPurpose | 'all')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all">All purposes</option>
                <option value="daily-reflection">Daily Reflection</option>
                <option value="event-reflection">Event Reflection</option>
                <option value="reading-resource">Reading Resource</option>
              </select>
            </div>
          </div>
        </div>

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterPurpose !== 'all'
                ? 'No entries match your search criteria.'
                : 'No entries found.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => handleEntryClick(entry.id)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {entry.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatDate(entry.date)}</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                        {getPurposeLabel(entry.purpose)}
                      </span>
                      <span className="capitalize">{entry.role} level</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {getContentPreview(entry.content)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
