'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FrequencyRole, JournalPurpose, Prompt } from '@/lib/promptPolicy';
import FrequencySetup from '@/components/FrequencySetup';
import PurposeGate from '@/components/PurposeGate';
import JournalEditor from '@/components/JournalEditor';
import PromptRail from '@/components/PromptRail';
import HelpButton from '@/components/HelpButton';

type AppState = 'setup' | 'purpose-selection' | 'editing';

export default function JournalPage() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>('setup');
  const [role, setRole] = useState<FrequencyRole>('beginner');
  const [purpose, setPurpose] = useState<JournalPurpose | null>(null);
  const [currentContent, setCurrentContent] = useState('');

  // Check for existing role on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('journal:frequencyRole') as FrequencyRole;
    if (savedRole && ['beginner', 'amateur', 'pro'].includes(savedRole)) {
      setRole(savedRole);
      setAppState('purpose-selection');
    }
  }, []);

  const handleRoleSelected = (selectedRole: string) => {
    setRole(selectedRole as FrequencyRole);
    setAppState('purpose-selection');
  };

  const handlePurposeSelected = (selectedPurpose: JournalPurpose | 'view-history') => {
    if (selectedPurpose === 'view-history') {
      router.push('/journal/history');
      return;
    }
    setPurpose(selectedPurpose);
    setAppState('editing');
  };

  const handlePromptClick = (prompt: Prompt) => {
    // For now, just log the prompt - could be enhanced to insert into editor
    console.log('Prompt clicked:', prompt.text);
  };

  const handleSuggestionInsert = (suggestion: string) => {
    // Dispatch custom event for the editor to handle
    const event = new CustomEvent('insert-suggestion', { detail: suggestion });
    window.dispatchEvent(event);
  };

  const handleContentChange = (content: string) => {
    setCurrentContent(content);
  };

  const handleEditorSave = (entryId: string) => {
    // Redirect to the saved entry's detail view
    router.push(`/journal/view/${entryId}`);
  };

  // Render based on app state
  if (appState === 'setup') {
    return <FrequencySetup onRoleSelected={handleRoleSelected} />;
  }

  if (appState === 'purpose-selection') {
    return <PurposeGate onPurposeSelected={handlePurposeSelected} />;
  }

  if (appState === 'editing' && purpose) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Header with Help Button */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Journal
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {purpose.replace('-', ' ')} • {role} level
                </p>
              </div>
              <HelpButton
                role={role}
                currentContent={currentContent}
                onInsertSuggestion={handleSuggestionInsert}
              />
            </div>
          </div>
        </div>

        {/* Prompt Rail */}
        <PromptRail
          role={role}
          purpose={purpose}
          onPromptClick={handlePromptClick}
        />

        {/* Journal Editor */}
        <JournalEditor
          purpose={purpose}
          role={role}
          onSave={handleEditorSave}
          onContentChange={handleContentChange}
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Loading...
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Setting up your journal experience
        </p>
      </div>
    </div>
  );
}
