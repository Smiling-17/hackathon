import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, logApiRequest, logApiError } from '@/lib/api-utils';
import { getGroqClient, isGroqAvailable } from '@/lib/groq';

export async function POST(request: NextRequest) {
  logApiRequest('/api/check-phone', 'POST');

  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.trim().length === 0) {
      return createErrorResponse('WARNING', 'Missing Phone Number', 'Phone number is required', 400);
    }

    // Validate phone number format (basic validation)
    const cleanedPhone = phoneNumber.trim().replace(/[\s\-\(\)]/g, '');
    if (cleanedPhone.length < 8 || cleanedPhone.length > 15) {
      return createErrorResponse('WARNING', 'Invalid Format', 'Phone number must be between 8 and 15 digits', 400);
    }

    // Use Groq API for phone number analysis
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
      
      // Analyze phone number with Groq
      const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Analyze this phone number for potential scam or spam indicators.

Phone Number: ${phoneNumber}
Cleaned Format: ${cleanedPhone}
Length: ${cleanedPhone.length} digits

Respond in Vietnamese with JSON format:
{
  "status": "DANGER" | "SAFE" | "WARNING" | "INFO",
  "title": "Short title in Vietnamese",
  "message": "Detailed explanation in Vietnamese. Include analysis based on: number patterns, country codes, common scam number formats, and general risk assessment.",
  "confidence": number between 0-100
}

Consider:
- Number patterns (repeated digits, suspicious sequences)
- Country code analysis
- Common scam/spam number formats
- Length and format anomalies
- General risk indicators

Note: This is a metadata-based analysis. For production, integrate with phone number reputation databases.`,
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
            title: parsed.title || 'Phân tích số điện thoại',
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
      if (lowerContent.includes('lừa đảo') || lowerContent.includes('scam') || lowerContent.includes('spam')) {
        status = 'DANGER';
      } else if (lowerContent.includes('an toàn') || lowerContent.includes('safe')) {
        status = 'SAFE';
      } else if (lowerContent.includes('cảnh báo') || lowerContent.includes('warning') || lowerContent.includes('nghi ngờ')) {
        status = 'WARNING';
      }

      return NextResponse.json({
        status,
        title: status === 'DANGER' ? 'Số điện thoại đáng nghi!' : status === 'WARNING' ? 'Cảnh báo' : 'Phân tích số điện thoại',
        message: content,
        confidence: status === 'DANGER' ? 75 : status === 'WARNING' ? 60 : 70,
      });
    } catch (groqError: any) {
      logApiError('/api/check-phone', groqError);
      
      return createErrorResponse(
        'DANGER',
        'Analysis Error',
        groqError.message || 'Failed to analyze phone number with Groq API. Please try again later.',
        500
      );
    }
  } catch (error: any) {
    logApiError('/api/check-phone', error);
    return createErrorResponse('DANGER', 'Server Error', 'Failed to process phone check request', 500);
  }
}

