import { NextRequest, NextResponse } from 'next/server';
import { validateBase64Image, createErrorResponse, logApiRequest, logApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  logApiRequest('/api/scan-video', 'POST');

  try {
    const body = await request.json();
    const { frames } = body;

    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return createErrorResponse('WARNING', 'Missing Frames', 'No video frames provided', 400);
    }

    // Validate each frame
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const validation = validateBase64Image(frame);
      if (!validation.valid) {
        return createErrorResponse(
          'WARNING',
          'Invalid Frame Format',
          `Frame ${i + 1}: ${validation.error}`,
          400
        );
      }

      // Validate frame size (max 5MB per frame)
      const frameSize = (frame.length * 3) / 4;
      const maxFrameSize = 5 * 1024 * 1024; // 5MB
      if (frameSize > maxFrameSize) {
        return createErrorResponse(
          'WARNING',
          'Frame Too Large',
          `Frame ${i + 1} is too large. Maximum size is 5MB per frame.`,
          400
        );
      }
    }

    // Use Groq API for video analysis
    const { analyzeVideoFramesWithGroq, isGroqAvailable } = await import('@/lib/groq');
    
    if (!isGroqAvailable()) {
      return createErrorResponse(
        'WARNING',
        'API Key Missing',
        'Groq API key is not configured. Please set GROQ_API_KEY in .env.local file.',
        503
      );
    }

    try {
      const analysis = await analyzeVideoFramesWithGroq(frames);
      return NextResponse.json(analysis);
    } catch (groqError: any) {
      logApiError('/api/scan-video', groqError);
      
      return createErrorResponse(
        'DANGER',
        'Analysis Error',
        groqError.message || 'Failed to analyze video with Groq API. Please try again later.',
        500
      );
    }
  } catch (error: any) {
    logApiError('/api/scan-video', error);
    return createErrorResponse('DANGER', 'Server Error', 'Failed to process video scan request', 500);
  }
}

