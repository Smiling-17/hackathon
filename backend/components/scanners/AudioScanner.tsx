'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, Music } from 'lucide-react';
import ResultCard from './ResultCard';

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
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
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
    } catch (error) {
      console.error('Error scanning audio:', error);
      setResult({
        status: 'DANGER',
        title: 'Error',
        message: 'Failed to scan audio. Please try again.',
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Audio Scanner</h2>
        <p className="text-gray-400 text-sm">
          Upload an audio file to detect scam calls, voice phishing, or suspicious audio patterns
        </p>
      </div>

      <div className="border-2 border-gray-700 rounded-lg p-12 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/wav"
          onChange={handleFileInput}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-400">Analyzing audio...</p>
            {fileName && (
              <p className="text-gray-500 text-sm">Processing: {fileName}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-950/50 flex items-center justify-center">
              <Music className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">
                Select an audio file to scan
              </p>
              <p className="text-gray-500 text-sm">
                Supports: MP3, WAV
              </p>
            </div>
            <div className="mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Select Audio File
              </button>
            </div>
          </div>
        )}
      </div>

      {result && <ResultCard result={result} />}
    </div>
  );
}

