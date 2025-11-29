'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, Music } from 'lucide-react';
import ResultCard from '@/components/ui/ResultCard';

interface ScanResult {
  status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  confidence: number;
}

export default function AudioScanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (file: File) => {
    // Validate file type
    const validMimeTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav'];
    const validExtensions = ['.mp3', '.wav'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    const isValidType = validMimeTypes.includes(file.type) || validExtensions.includes(fileExtension);
    
    if (!isValidType) {
      alert('Please upload an audio file (.mp3 or .wav)');
      return;
    }

    // Validate file size (max 25MB for audio)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      setResult({
        status: 'WARNING',
        title: 'File Too Large',
        message: 'Audio file is too large. Maximum size is 25MB.',
        confidence: 0,
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setResult(null);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/scan-audio', {
        method: 'POST',
        body: formData,
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
      console.error('Error scanning audio:', error);
      setResult({
        status: 'DANGER',
        title: 'Error',
        message: error?.message || 'Failed to scan audio. Please try again.',
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
          accept="audio/mpeg,audio/mp3,audio/wav"
          onChange={handleFileInput}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-cyber-red animate-spin" />
            <p className="text-gray-400">Analyzing audio...</p>
            {fileName && (
              <p className="text-gray-500 text-sm">Processing: {fileName}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cyber-red/20 flex items-center justify-center">
              <Music className="w-8 h-8 text-cyber-red" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">
                Select an audio file to scan
              </p>
              <p className="text-gray-500 text-sm">
                Supports: MP3, WAV (Max 25MB)
              </p>
            </div>
            <div className="mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-red hover:bg-cyber-red/80 text-white font-semibold rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Select Audio File
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

