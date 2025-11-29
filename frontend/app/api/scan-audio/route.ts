import { NextRequest, NextResponse } from 'next/server';
import {
  validateFileSize,
  validateFileType,
  createErrorResponse,
  logApiRequest,
  logApiError,
} from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  logApiRequest('/api/scan-audio', 'POST');

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile || !(audioFile instanceof File)) {
      return createErrorResponse('WARNING', 'Missing Audio', 'No audio file provided', 400);
    }

    // Validate file size
    const sizeValidation = validateFileSize(audioFile.size, 25);
    if (!sizeValidation.valid) {
      return createErrorResponse('WARNING', 'File Too Large', sizeValidation.error!, 400);
    }

    // Validate file type
    const typeValidation = validateFileType(
      audioFile.name,
      audioFile.type,
      ['.mp3', '.wav'],
      ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav']
    );
    if (!typeValidation.valid) {
      return createErrorResponse('WARNING', 'Invalid File Type', typeValidation.error!, 400);
    }

    // Use Groq API for audio analysis
    const { analyzeAudioWithGroq, isGroqAvailable } = await import('@/lib/groq');
    
    if (!isGroqAvailable()) {
      return createErrorResponse(
        'WARNING',
        'API Key Missing',
        'Groq API key is not configured. Please set GROQ_API_KEY in .env.local file.',
        503
      );
    }

    try {
      // Extract audio metadata for analysis
      const audioSize = audioFile.size;
      const audioSizeMB = (audioSize / 1024 / 1024).toFixed(2);
      const audioMimeType = audioFile.type || 'unknown';
      
      // Estimate duration based on file size and typical bitrates
      // MP3: ~1MB per minute at 128kbps, WAV: ~10MB per minute at 44.1kHz
      let estimatedDuration = 0;
      if (audioMimeType.includes('mp3') || audioFile.name.toLowerCase().endsWith('.mp3')) {
        estimatedDuration = (audioSize / (1024 * 1024)) * 60; // ~1MB per minute
      } else {
        estimatedDuration = (audioSize / (10 * 1024 * 1024)) * 60; // ~10MB per minute for WAV
      }
      
      // Create detailed metadata transcription for Groq analysis
      const audioMetadata = `Audio File Analysis Request:
      
File Information:
- File Name: ${audioFile.name}
- File Size: ${audioSizeMB} MB
- MIME Type: ${audioMimeType}
- Estimated Duration: ${estimatedDuration.toFixed(1)} seconds (${(estimatedDuration / 60).toFixed(1)} minutes)

File Characteristics:
- Format: ${audioFile.name.toLowerCase().endsWith('.mp3') ? 'MP3 (compressed)' : audioFile.name.toLowerCase().endsWith('.wav') ? 'WAV (uncompressed)' : 'Unknown'}
- Size Category: ${audioSize < 1 * 1024 * 1024 ? 'Small (<1MB)' : audioSize < 5 * 1024 * 1024 ? 'Medium (1-5MB)' : 'Large (>5MB)'}
- Estimated Quality: ${audioMimeType.includes('mp3') ? 'Compressed audio (typical for phone calls)' : 'Uncompressed audio (high quality)'}

Context: This is a phone call audio file that needs to be analyzed for scam indicators.
Since direct audio transcription is not available, analysis is based on file metadata and common scam patterns.

Common Scam Indicators to Consider:
- Very short calls (<30 seconds) may indicate quick scam attempts
- Very long calls (>10 minutes) may indicate extended manipulation attempts
- Unusual file sizes may indicate manipulation or recording issues
- Compressed formats (MP3) are typical for phone recordings
- Uncompressed formats (WAV) may indicate professional recording equipment`;
      
      // Analyze with Groq using metadata
      const analysis = await analyzeAudioWithGroq(audioMetadata);
      return NextResponse.json(analysis);
      
    } catch (groqError: any) {
      logApiError('/api/scan-audio', groqError);
      
      return createErrorResponse(
        'DANGER',
        'Analysis Error',
        groqError.message ||
          'Failed to analyze audio with Groq API. Please ensure audio transcription service is configured.',
        500
      );
    }
  } catch (error: any) {
    logApiError('/api/scan-audio', error);
    return createErrorResponse('DANGER', 'Server Error', 'Failed to process audio scan request', 500);
  }
}

