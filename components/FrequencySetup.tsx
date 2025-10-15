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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Journal
          </h1>
          <p className="text-gray-600">
            How often do you plan to journal?
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleFrequencySelect('once-a-week')}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="font-medium text-gray-900">Once a week</div>
            <div className="text-sm text-gray-500">Perfect for beginners</div>
          </button>

          <button
            onClick={() => handleFrequencySelect('every-2-days')}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="font-medium text-gray-900">Once every 2 days</div>
            <div className="text-sm text-gray-500">Great for regular practice</div>
          </button>

          <button
            onClick={() => handleFrequencySelect('everyday')}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="font-medium text-gray-900">Everyday</div>
            <div className="text-sm text-gray-500">For dedicated practitioners</div>
          </button>
        </div>
      </div>
    </div>
  );
}
