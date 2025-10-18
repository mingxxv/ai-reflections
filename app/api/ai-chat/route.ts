import { NextRequest, NextResponse } from 'next/server';

// Backend API URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:7777';

/**
 * AI CHAT API - Proxy to Backend
 *
 * This route now proxies requests to the mcp-demo backend server
 * which provides AI-powered reflection questions using Cerebras Cloud.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Proxy request to backend
    const response = await fetch(`${BACKEND_URL}/api/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Backend request failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend server' },
      { status: 500 }
    );
  }
}
