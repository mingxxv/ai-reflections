// API Configuration
// Configure backend URL based on environment

// Backend API URL (mcp-demo server)
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:7777';

// API endpoints
export const API_ENDPOINTS = {
  aiChat: `${BACKEND_URL}/api/ai-chat`,
  journal: `${BACKEND_URL}/api/journal`,
  chatSessions: `${BACKEND_URL}/api/chat-sessions`,
  pdfs: `${BACKEND_URL}/api/pdfs`,
};

// Helper function to make API calls with proper error handling
export async function apiCall(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
