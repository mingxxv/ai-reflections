'use client';

import { mapFrequencyToRole } from '@/lib/promptPolicy';

interface FrequencySetupProps {
  onRoleSelected: (role: string) => void;
}

export default function FrequencySetup({ onRoleSelected }: FrequencySetupProps) {
  const handleFrequencySelect = (frequency: string) => {
    const role = mapFrequencyToRole(frequency);
    localStorage.setItem('journal:frequencyRole', role);
    onRoleSelected(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            How often do you plan to journal?
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleFrequencySelect('once-a-week')}
            className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">Once a week</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Perfect for beginners</div>
          </button>

          <button
            onClick={() => handleFrequencySelect('every-2-days')}
            className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">Once every 2 days</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Great for regular practice</div>
          </button>

          <button
            onClick={() => handleFrequencySelect('everyday')}
            className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">Everyday</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">For dedicated practitioners</div>
          </button>
        </div>
      </div>
    </div>
  );
}
