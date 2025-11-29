import { NextResponse } from 'next/server';

/**
 * Standard API response format
 */
export interface ApiResponse {
  status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  confidence: number;
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  status: ApiResponse['status'],
  title: string,
  message: string,
  httpStatus: number = 500
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      status,
      title,
      message,
      confidence: 0,
    },
    { status: httpStatus }
  );
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse(
  status: ApiResponse['status'],
  title: string,
  message: string,
  confidence: number
): NextResponse<ApiResponse> {
  return NextResponse.json({
    status,
    title,
    message,
    confidence,
  });
}

/**
 * Validate base64 image format
 */
export function validateBase64Image(image: string): { valid: boolean; error?: string } {
  if (!image || typeof image !== 'string') {
    return { valid: false, error: 'Image data is required' };
  }

  if (!image.startsWith('data:image/')) {
    return { valid: false, error: 'Image must be in base64 data URL format' };
  }

  // Validate base64 size (max 10MB)
  const base64Size = (image.length * 3) / 4;
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (base64Size > maxSize) {
    return { valid: false, error: 'Image file is too large. Maximum size is 10MB.' };
  }

  return { valid: true };
}

/**
 * Validate file size
 */
export function validateFileSize(
  fileSize: number,
  maxSizeMB: number
): { valid: boolean; error?: string } {
  const maxSize = maxSizeMB * 1024 * 1024;
  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSizeMB}MB.`,
    };
  }
  return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(
  fileName: string,
  mimeType: string,
  allowedExtensions: string[],
  allowedMimeTypes: string[]
): { valid: boolean; error?: string } {
  // Check if file has extension
  const lastDotIndex = fileName.lastIndexOf('.');
  const hasExtension = lastDotIndex > 0 && lastDotIndex < fileName.length - 1;
  
  let isValidExtension = false;
  if (hasExtension) {
    const fileExtension = fileName.toLowerCase().substring(lastDotIndex);
    isValidExtension = allowedExtensions.includes(fileExtension);
  }
  
  // Check MIME type (handle empty or undefined mimeType)
  const isValidMimeType = mimeType && allowedMimeTypes.some((type) => mimeType.toLowerCase().includes(type.toLowerCase()));

  if (!isValidExtension && !isValidMimeType) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Log API request for debugging
 */
export function logApiRequest(endpoint: string, method: string, metadata?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${method} ${endpoint}`, metadata || '');
  }
}

/**
 * Log API error
 */
export function logApiError(endpoint: string, error: any) {
  console.error(`[API Error] ${endpoint}:`, {
    message: error?.message,
    stack: error?.stack,
    status: error?.status,
  });
}

