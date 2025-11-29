import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, logApiRequest, logApiError } from '@/lib/api-utils';
import { getGroqClient, isGroqAvailable } from '@/lib/groq';

export async function POST(request: NextRequest) {
  logApiRequest('/api/check-location', 'POST');

  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return createErrorResponse('WARNING', 'Invalid Coordinates', 'Latitude and longitude must be valid numbers', 400);
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return createErrorResponse('WARNING', 'Invalid Latitude', 'Latitude must be between -90 and 90', 400);
    }
    if (longitude < -180 || longitude > 180) {
      return createErrorResponse('WARNING', 'Invalid Longitude', 'Longitude must be between -180 and 180', 400);
    }

    // Use Groq API for location analysis
    if (!isGroqAvailable()) {
      return createErrorResponse(
        'WARNING',
        'API Key Missing',
        'Groq API key is not configured. Please set GROQ_API_KEY in .env.local file.',
        503
      );
    }

    try {
      const client = getGroqClient();
      
      // Analyze location with Groq
      const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Analyze this location for safety and security risks, especially in the context of Vietnam.

Coordinates:
- Latitude: ${latitude}
- Longitude: ${longitude}

Respond in Vietnamese with JSON format:
{
  "status": "DANGER" | "SAFE" | "WARNING" | "INFO",
  "title": "Short title in Vietnamese",
  "message": "Detailed explanation in Vietnamese. Include: general area assessment, common risks in Vietnam (phone snatching, pickpocketing, scams), safety recommendations, and time-of-day considerations.",
  "confidence": number between 0-100
}

Consider:
- General area safety (urban vs rural, tourist areas, etc.)
- Common risks in Vietnam (especially in major cities like Ho Chi Minh City, Hanoi)
- Phone snatching hotspots
- Pickpocketing risks
- Scam activity patterns
- Time-of-day safety considerations
- Recommendations for staying safe

Note: This is a general risk assessment. For production, integrate with crime databases and real-time incident reports.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from Groq');
      }

      // Try to parse JSON from response
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          
          // Validate and clamp confidence to 0-100
          const confidence = typeof parsed.confidence === 'number' 
            ? Math.max(0, Math.min(100, parsed.confidence))
            : 50;
          
          // Validate status
          const validStatuses = ['DANGER', 'SAFE', 'WARNING', 'INFO'];
          const status = validStatuses.includes(parsed.status) ? parsed.status : 'WARNING';
          
          return NextResponse.json({
            status: status as 'DANGER' | 'SAFE' | 'WARNING' | 'INFO',
            title: parsed.title || 'Phân tích vị trí',
            message: parsed.message || content,
            confidence,
          });
        }
      } catch (parseError) {
        console.warn('Failed to parse Groq JSON response, using text extraction');
      }

      // Fallback: extract information from text
      const lowerContent = content.toLowerCase();
      let status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO' = 'INFO';
      if (lowerContent.includes('nguy hiểm') || lowerContent.includes('danger') || lowerContent.includes('rủi ro cao')) {
        status = 'DANGER';
      } else if (lowerContent.includes('an toàn') || lowerContent.includes('safe')) {
        status = 'SAFE';
      } else if (lowerContent.includes('cảnh báo') || lowerContent.includes('warning') || lowerContent.includes('cẩn thận')) {
        status = 'WARNING';
      }

      return NextResponse.json({
        status,
        title: status === 'DANGER' ? 'Vị trí nguy hiểm!' : status === 'WARNING' ? 'Cảnh báo' : 'Thông tin vị trí',
        message: content,
        confidence: status === 'DANGER' ? 75 : status === 'WARNING' ? 60 : 70,
      });
    } catch (groqError: any) {
      logApiError('/api/check-location', groqError);
      
      return createErrorResponse(
        'DANGER',
        'Analysis Error',
        groqError.message || 'Failed to analyze location with Groq API. Please try again later.',
        500
      );
    }
  } catch (error: any) {
    logApiError('/api/check-location', error);
    return createErrorResponse('DANGER', 'Server Error', 'Failed to process location check request', 500);
  }
}

