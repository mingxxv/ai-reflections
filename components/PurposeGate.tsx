'use client';

import { JournalPurpose } from '@/lib/promptPolicy';

interface PurposeGateProps {
  onPurposeSelected: (purpose: JournalPurpose | 'view-history') => void;
}

export default function PurposeGate({ onPurposeSelected }: PurposeGateProps) {
  const purposes = [
    {
      id: 'daily-reflection' as JournalPurpose,
      title: 'Daily Reflection',
      description: 'Reflect on your day and experiences'
    },
    {
      id: 'event-reflection' as JournalPurpose,
      title: 'Event Reflection',
      description: 'Process a specific event or situation'
    },
    {
      id: 'reading-resource' as JournalPurpose,
      title: 'Reading the Resource',
      description: 'Reflect on materials you&apos;ve read'
    },
    {
      id: 'view-history' as const,
      title: 'View Past Journals',
      description: 'Browse your previous journal entries'
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          What&apos;s your focus today?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {purposes.map((purpose) => (
            <button
              key={purpose.id}
              onClick={() => onPurposeSelected(purpose.id)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="font-medium text-gray-900 mb-1">
                {purpose.title}
              </div>
              <div className="text-sm text-gray-500">
                {purpose.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
