'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, Video } from 'lucide-react';
import ResultCard from '@/components/ui/ResultCard';

interface ScanResult {
  status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  confidence: number;
}

export default function VideoScanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractFrame = useCallback((video: HTMLVideoElement, time: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        reject(new Error('Canvas not available'));
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      let timeoutId: NodeJS.Timeout | null = null;
      
      // Cleanup function
      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
      };

      const onSeeked = () => {
        try {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          
          // Validate video dimensions
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            throw new Error('Video has invalid dimensions');
          }
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          
          // Validate base64 output
          if (!base64 || base64.length === 0) {
            throw new Error('Failed to generate base64 image');
          }
          
          cleanup();
          resolve(base64);
        } catch (error) {
          cleanup();
          reject(new Error('Failed to extract frame from video'));
        }
      };

      const onError = () => {
        cleanup();
        reject(new Error('Failed to seek video'));
      };

      video.addEventListener('seeked', onSeeked, { once: true });
      video.addEventListener('error', onError, { once: true });
      
      video.currentTime = time;
      
      // Timeout safety (5 seconds max per frame)
      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Frame extraction timeout'));
      }, 5000);
    });
  }, []);

  const extractFrames = useCallback(async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = videoRef.current;
      if (!video) {
        reject(new Error('Video element not available'));
        return;
      }

      const url = URL.createObjectURL(file);
      
      const cleanup = () => {
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.removeEventListener('error', onError);
        URL.revokeObjectURL(url);
      };

      const onLoadedMetadata = async () => {
        try {
          const duration = video.duration;
          
          // Validate video duration (must be at least 1 second)
          if (!duration || duration < 1) {
            cleanup();
            reject(new Error('Video is too short or invalid'));
            return;
          }

          // Calculate frame times, ensure they're within valid range
          const frameTimes = [
            Math.max(0.1, duration * 0.2),  // 20%, min 0.1s
            Math.max(0.1, duration * 0.5),  // 50%, min 0.1s
            Math.min(duration - 0.1, duration * 0.8),  // 80%, max duration-0.1s
          ].filter(time => time >= 0.1 && time < duration);

          if (frameTimes.length === 0) {
            cleanup();
            reject(new Error('Could not determine valid frame times'));
            return;
          }

          const frames: string[] = [];
          for (const time of frameTimes) {
            const frame = await extractFrame(video, time);
            frames.push(frame);
          }

          cleanup();
          resolve(frames);
        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      const onError = () => {
        cleanup();
        reject(new Error('Failed to load video'));
      };

      video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
      video.addEventListener('error', onError, { once: true });
      
      video.src = url;
    });
  }, [extractFrame]);

  const handleScan = async (file: File) => {
    // Validate file type
    const validMimeTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
    const validExtensions = ['.mp4', '.mov', '.mpeg'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    const isValidType = validMimeTypes.some(type => file.type.includes(type)) || 
                        validExtensions.includes(fileExtension);
    
    if (!isValidType) {
      alert('Please upload a video file (.mp4, .mov, or .mpeg)');
      return;
    }

    // Validate file size (max 100MB for video)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setResult({
        status: 'WARNING',
        title: 'File Too Large',
        message: 'Video file is too large. Maximum size is 100MB.',
        confidence: 0,
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setFileName(file.name);

    try {
      // Extract 3 frames from the video
      const frames = await extractFrames(file);

      // Send frames to API
      const response = await fetch('/api/scan-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frames }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        
        // If API returns error in standard format, use it
        if (errorData && errorData.status && errorData.title && errorData.message) {
          setResult({
            status: errorData.status,
            title: errorData.title,
            message: errorData.message,
            confidence: errorData.confidence || 0,
          });
          setIsLoading(false);
          return;
        }
        
        throw new Error(errorData?.message || `API error: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Failed to parse API response');
      }
      
      // Validate response format
      if (!data || typeof data !== 'object' || !data.status || !data.title || !data.message) {
        throw new Error('Invalid response format from API');
      }
      
      setResult(data);
    } catch (error: any) {
      console.error('Error scanning video:', error);
      setResult({
        status: 'DANGER',
        title: 'Error',
        message: error?.message || 'Failed to scan video. Please try again.',
        confidence: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleScan(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="border-2 border-slate-700 rounded-lg p-12 text-center bg-slate-900/50">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Hidden video and canvas elements for frame extraction */}
        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} className="hidden" />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-cyber-yellow animate-spin" />
            <p className="text-gray-400">Extracting frames and analyzing video...</p>
            {fileName && (
              <p className="text-gray-500 text-sm">Processing: {fileName}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cyber-yellow/20 flex items-center justify-center">
              <Video className="w-8 h-8 text-cyber-yellow" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">
                Select a video file to scan
              </p>
              <p className="text-gray-500 text-sm">
                Supports: MP4 (will extract frames at 20%, 50%, 80%)
              </p>
            </div>
            <div className="mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-yellow hover:bg-cyber-yellow/80 text-slate-950 font-semibold rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Select Video File
              </button>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-6">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
}

