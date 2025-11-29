import { NextRequest, NextResponse } from 'next/server';
import { validateBase64Image, createErrorResponse, logApiRequest, logApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  logApiRequest('/api/scan-image', 'POST');

  try {
    const body = await request.json();
    const { image } = body;

    // Validate image input
    const validation = validateBase64Image(image);
    if (!validation.valid) {
      return createErrorResponse('WARNING', 'Invalid Image', validation.error!, 400);
    }

    // Use Groq API for image analysis
    const { analyzeImageWithGroq, isGroqAvailable } = await import('@/lib/groq');
    
    if (!isGroqAvailable()) {
      return createErrorResponse(
        'WARNING',
        'API Key Missing',
        'Groq API key is not configured. Please set GROQ_API_KEY in .env.local file.',
        503
      );
    }

    try {
      const analysis = await analyzeImageWithGroq(image);
      return NextResponse.json(analysis);
    } catch (groqError: any) {
      logApiError('/api/scan-image', groqError);
      
      return createErrorResponse(
        'DANGER',
        'Analysis Error',
        groqError.message || 'Failed to analyze image with Groq API. Please try again later.',
        500
      );
    }
  } catch (error: any) {
    logApiError('/api/scan-image', error);
    return createErrorResponse(
      'DANGER',
      'Server Error',
      'Failed to process image scan request',
      500
    );
  }
}

