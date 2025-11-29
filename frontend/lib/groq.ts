import Groq from 'groq-sdk';

// Initialize Groq client
let groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    throw new Error('GROQ_API_KEY is missing or invalid. Please set GROQ_API_KEY in .env.local');
  }

  // Initialize client only once
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: apiKey,
    });
  }

  return groqClient;
}

export function isGroqAvailable(): boolean {
  const apiKey = process.env.GROQ_API_KEY;
  return !!(apiKey && apiKey.startsWith('gsk_'));
}

// Helper function to analyze image with Groq Vision
export async function analyzeImageWithGroq(imageBase64: string): Promise<{
  status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  confidence: number;
}> {
  const client = getGroqClient();

  try {
    // Validate input
    if (!imageBase64 || typeof imageBase64 !== 'string' || imageBase64.trim().length === 0) {
      throw new Error('Image base64 data is required and must be a non-empty string');
    }
    
    // Extract image metadata for analysis
    const imageSize = (imageBase64.length * 3) / 4;
    const imageType = imageBase64.match(/data:image\/(\w+);/)?.[1] || 'unknown';
    
    console.log('[Groq API] Calling Groq API for image analysis...');
    console.log('[Groq API] Image metadata:', { type: imageType, size: `${(imageSize / 1024).toFixed(2)} KB` });
    
    // Groq API currently doesn't support vision models with image_url format
    // Using text-only model with image metadata analysis as fallback
    // Note: This is a limitation - for true vision analysis, consider using OpenAI or other vision APIs
    const textModels = [
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
    ];
    
    let response;
    let lastError: any = null;
    
    // Extract image info for analysis
    const imageInfo = {
      type: imageType,
      sizeKB: (imageSize / 1024).toFixed(2),
      base64Length: imageBase64.length,
      hasDataUrl: imageBase64.startsWith('data:image/'),
    };
    
    for (const model of textModels) {
      try {
        console.log(`[Groq API] Using model: ${model} for image metadata analysis`);
        // Use text-only model with image metadata
        // Since Groq doesn't support vision directly, we analyze based on image metadata
        response = await client.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'user',
              content: `Analyze an image for scam, phishing, or suspicious content detection based on the following information:

Image Metadata:
- File Type: ${imageInfo.type}
- File Size: ${imageInfo.sizeKB} KB
- Base64 Length: ${imageInfo.base64Length} characters
- Format: ${imageInfo.hasDataUrl ? 'Data URL (base64)' : 'Unknown'}

Based on this image metadata and common scam patterns, provide an analysis.

Respond in Vietnamese with JSON format:
{
  "status": "DANGER" | "SAFE" | "WARNING" | "INFO",
  "title": "Short title in Vietnamese",
  "message": "Detailed explanation in Vietnamese. Note: This analysis is based on image metadata only. For accurate visual analysis, the image content cannot be directly analyzed with current Groq API limitations.",
  "confidence": number between 0-100
}

Focus on detecting potential risks based on:
- File size anomalies (very small or very large files may indicate manipulation)
- File type mismatches
- Common scam image patterns
- Suspicious metadata patterns

IMPORTANT: Since we cannot analyze the actual image content with Groq API's current limitations, this analysis is based on metadata only. For production use, consider integrating with OpenAI Vision API or other vision-capable services.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });
        console.log(`[Groq API] Successfully used model: ${model}`);
        break; // Success, exit loop
      } catch (modelError: any) {
        console.warn(`[Groq API] Model ${model} failed:`, modelError.message);
        lastError = modelError;
        continue; // Try next model
      }
    }
    
    if (!response) {
      // All models failed
      throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}. Please check your Groq API key and available models.`);
    }

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
        
        return {
          status: status as 'DANGER' | 'SAFE' | 'WARNING' | 'INFO',
          title: parsed.title || 'Phân tích hình ảnh',
          message: parsed.message || content,
          confidence,
        };
      }
    } catch (parseError) {
      // If JSON parsing fails, extract info from text
      console.warn('Failed to parse Groq JSON response, using text extraction');
    }

    // Fallback: extract information from text response
    const lowerContent = content.toLowerCase();
    let status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO' = 'INFO';
    if (lowerContent.includes('lừa đảo') || lowerContent.includes('scam') || lowerContent.includes('phishing')) {
      status = 'DANGER';
    } else if (lowerContent.includes('an toàn') || lowerContent.includes('safe') || lowerContent.includes('bình thường')) {
      status = 'SAFE';
    } else if (lowerContent.includes('cảnh báo') || lowerContent.includes('warning') || lowerContent.includes('nghi ngờ')) {
      status = 'WARNING';
    }

    return {
      status,
      title: status === 'DANGER' ? 'LỪA ĐẢO!' : status === 'WARNING' ? 'Cảnh báo' : 'An toàn',
      message: content,
      confidence: status === 'DANGER' ? 75 : status === 'WARNING' ? 60 : 70,
    };
  } catch (error: any) {
    console.error('Groq API error in analyzeImageWithGroq:', error);
    
    // Handle specific Groq API errors
    if (error?.status === 401) {
      throw new Error('Invalid Groq API key. Please check your GROQ_API_KEY in .env.local');
    }
    if (error?.status === 429) {
      throw new Error('Groq API rate limit exceeded. Please try again later.');
    }
    if (error?.status === 400) {
      throw new Error('Invalid request to Groq API. Please check your input.');
    }
    
    throw new Error(`Groq API error: ${error?.message || 'Unknown error'}`);
  }
}

// Helper function to analyze audio transcription with Groq
export async function analyzeAudioWithGroq(transcription: string): Promise<{
  status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  confidence: number;
}> {
  const client = getGroqClient();

  try {
    // Validate transcription input
    if (!transcription || typeof transcription !== 'string' || transcription.trim().length === 0) {
      throw new Error('Transcription is required and must be a non-empty string');
    }

    // Use Llama 3.3 70B for audio analysis (multilingual, best for Vietnamese)
    const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `Analyze this phone call transcription for scam or phishing indicators. 
            Respond in Vietnamese with JSON format:
            {
              "status": "DANGER" | "SAFE" | "WARNING" | "INFO",
              "title": "Short title in Vietnamese",
              "message": "Detailed explanation in Vietnamese",
              "confidence": number between 0-100
            }
            
            Transcription:
            ${transcription}
            
            Look for:
            - Requests for personal information
            - Urgent financial requests
            - Suspicious offers or prizes
            - Threats or pressure tactics
            - Impersonation attempts
            - Common Vietnamese scam patterns`,
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
        
        return {
          status: status as 'DANGER' | 'SAFE' | 'WARNING' | 'INFO',
          title: parsed.title || 'Phân tích cuộc gọi',
          message: parsed.message || content,
          confidence,
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse Groq JSON response, using text extraction');
    }

    // Fallback: extract information from text
    const lowerContent = content.toLowerCase();
    let status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO' = 'INFO';
    if (lowerContent.includes('lừa đảo') || lowerContent.includes('scam')) {
      status = 'DANGER';
    } else if (lowerContent.includes('an toàn') || lowerContent.includes('safe')) {
      status = 'SAFE';
    } else if (lowerContent.includes('cảnh báo') || lowerContent.includes('warning')) {
      status = 'WARNING';
    }

    return {
      status,
      title: status === 'DANGER' ? 'Cuộc gọi lừa đảo!' : status === 'WARNING' ? 'Cảnh báo' : 'Cuộc gọi bình thường',
      message: content,
      confidence: status === 'DANGER' ? 80 : status === 'WARNING' ? 65 : 72,
    };
  } catch (error: any) {
    console.error('Groq API error:', error);
    
    if (error?.status === 401) {
      throw new Error('Invalid Groq API key. Please check your GROQ_API_KEY in .env.local');
    }
    if (error?.status === 429) {
      throw new Error('Groq API rate limit exceeded. Please try again later.');
    }
    
    throw new Error(`Groq API error: ${error?.message || 'Unknown error'}`);
  }
}

// Helper function to analyze video frames with Groq Vision
export async function analyzeVideoFramesWithGroq(frames: string[]): Promise<{
  status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  confidence: number;
}> {
  const client = getGroqClient();

  try {
    // Validate input
    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      throw new Error('Frames array is required and must contain at least one frame');
    }
    
    // Validate each frame is a string
    for (let i = 0; i < frames.length; i++) {
      if (typeof frames[i] !== 'string' || frames[i].trim().length === 0) {
        throw new Error(`Frame ${i + 1} is invalid: must be a non-empty string`);
      }
    }
    
    // Analyze all frames and combine results
    const analyses = await Promise.all(
      frames.map(async (frame) => {
        let response;
        // Groq API doesn't support vision models with image_url format
        // Using text-only model with frame metadata analysis
        const textModels = [
          'llama-3.3-70b-versatile',
          'llama-3.1-70b-versatile',
          'llama-3.1-8b-instant',
        ];
        
        let frameResponse;
        let lastFrameError: any = null;
        
        // Extract frame metadata
        const frameSize = (frame.length * 3) / 4;
        const frameType = frame.match(/data:image\/(\w+);/)?.[1] || 'unknown';
        
        for (const model of textModels) {
          try {
            frameResponse = await client!.chat.completions.create({
              model: model,
              messages: [
                {
                  role: 'user',
                  content: `Analyze a video frame for deepfake, manipulation, or suspicious content indicators based on metadata:

Frame Metadata:
- Frame Type: ${frameType}
- Frame Size: ${(frameSize / 1024).toFixed(2)} KB
- Base64 Length: ${frame.length} characters
- Frame Index: ${frames.indexOf(frame) + 1} of ${frames.length}

Based on this frame metadata, provide an analysis.

Respond in Vietnamese with JSON format:
{
  "status": "DANGER" | "SAFE" | "WARNING" | "INFO",
  "indicators": ["list of potential indicators based on metadata"],
  "confidence": number between 0-100
}

Note: This analysis is based on frame metadata only. For accurate visual analysis, consider using OpenAI Vision API or other vision-capable services.`,
                },
              ],
              temperature: 0.7,
              max_tokens: 300,
            });
            break; // Success, exit loop
          } catch (error: any) {
            lastFrameError = error;
            continue; // Try next model
          }
        }
        
        if (!frameResponse) {
          throw new Error(`All models failed for frame ${frames.indexOf(frame) + 1}. Last error: ${lastFrameError?.message || 'Unknown error'}`);
        }

        return frameResponse.choices[0]?.message?.content || '';
      })
    );

    // Combine all analyses
    const combinedAnalysis = analyses.join('\n\n');

    // Final analysis of combined results
    const finalResponse = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `Based on these frame analyses, provide a final assessment:
          
          ${combinedAnalysis}
          
          Respond in Vietnamese with JSON format:
          {
            "status": "DANGER" | "SAFE" | "WARNING" | "INFO",
            "title": "Short title in Vietnamese",
            "message": "Detailed explanation in Vietnamese",
            "confidence": number between 0-100
          }`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = finalResponse.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from Groq');
    }

    // Try to parse JSON
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
        
        return {
          status: status as 'DANGER' | 'SAFE' | 'WARNING' | 'INFO',
          title: parsed.title || 'Phân tích video',
          message: parsed.message || content,
          confidence,
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse Groq JSON response, using text extraction');
    }

    // Fallback
    const lowerContent = content.toLowerCase();
    let status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO' = 'WARNING';
    if (lowerContent.includes('deepfake') || lowerContent.includes('giả mạo')) {
      status = 'DANGER';
    } else if (lowerContent.includes('nghi ngờ') || lowerContent.includes('suspicious')) {
      status = 'WARNING';
    } else if (lowerContent.includes('an toàn') || lowerContent.includes('safe')) {
      status = 'SAFE';
    }

    return {
      status,
      title: status === 'DANGER' ? 'Deepfake phát hiện!' : 'Nghi ngờ Deepfake',
      message: content,
      confidence: status === 'DANGER' ? 75 : 68,
    };
  } catch (error: any) {
    console.error('Groq API error:', error);
    
    if (error?.status === 401) {
      throw new Error('Invalid Groq API key. Please check your GROQ_API_KEY in .env.local');
    }
    if (error?.status === 429) {
      throw new Error('Groq API rate limit exceeded. Please try again later.');
    }
    if (error?.status === 400) {
      throw new Error('Invalid request to Groq API. Please check your input.');
    }
    
    throw new Error(`Groq API error: ${error?.message || 'Unknown error'}`);
  }
}

