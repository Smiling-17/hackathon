import { NextResponse } from 'next/server';
import { isGroqAvailable } from '@/lib/groq';

/**
 * Health check endpoint
 * Returns API status and Groq configuration
 */
export async function GET() {
  const groqAvailable = isGroqAvailable();

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      groq: {
        available: groqAvailable,
        message: groqAvailable
          ? 'Groq API is configured and ready'
          : 'Groq API key is not configured',
      },
    },
  });
}

