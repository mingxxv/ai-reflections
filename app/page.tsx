"use client";

import { useEffect, useState } from "react";

interface DadJoke {
  id: string;
  joke: string;
  status: number;
}

/**
 * Home Page
 *
 * Main landing page displaying a dad joke from icanhazdadjoke.com API.
 * Features:
 * - Fetches a random dad joke on page load
 * - Mobile-first responsive design
 * - Loading and error states
 *
 * API: https://icanhazdadjoke.com/
 * Documentation: https://icanhazdadjoke.com/api
 *
 * @returns Rendered home page with dad joke
 */
export default function Home() {
  const [joke, setJoke] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch a random dad joke from the API
   */
  const fetchJoke = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DadJoke = await response.json();
      setJoke(data.joke);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch joke");
      console.error("Error fetching dad joke:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch joke on component mount
  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header section */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center">
            {/* Logo */}
            <img
              src="/Daddybuddy.png"
              alt="DaddyBuddy Logo"
              className="h-[80px] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Dad Joke Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="text-center mb-6">
            <span className="text-6xl mb-4 block">😄</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dad Joke of the Moment
            </h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading joke...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Oops! {error}
              </p>
              <button
                onClick={fetchJoke}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Joke Display */}
          {joke && !loading && !error && (
            <div className="text-center">
              <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-200 leading-relaxed mb-8">
                {joke}
              </p>
              <button
                onClick={fetchJoke}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Another Joke
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Built with ❤️ from #HACK 2025 Challenge 10
          </p>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            All honour and glory to God
          </p>
        </div>
      </footer>
    </div>
  );
}
