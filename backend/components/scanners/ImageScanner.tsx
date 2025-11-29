'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import ResultCard from './ResultCard';

interface ScanResult {
  status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  confidence: number;
}

export default function ImageScanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleScan = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setResult({
          status: 'WARNING',
          title: 'File Too Large',
          message: 'Image file is too large. Maximum size is 10MB.',
          confidence: 0,
        });
        setIsLoading(false);
        return;
      }

      const base64 = await convertToBase64(file);

      const response = await fetch('/api/scan-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
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
      console.error('Error scanning image:', error);
      setResult({
        status: 'DANGER',
        title: 'Error',
        message: 'Failed to scan image. Please try again.',
        confidence: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleScan(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
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
        <h2 className="text-2xl font-bold text-white mb-2">Image Scanner</h2>
        <p className="text-gray-400 text-sm">
          Upload an image to detect scams, phishing attempts, or suspicious content
        </p>
      </div>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center transition-all
          ${dragActive 
            ? 'border-blue-500 bg-blue-950/20' 
            : 'border-gray-700 hover:border-gray-600'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-400">Analyzing image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-950/50 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">
                Drop an image here or click to browse
              </p>
              <p className="text-gray-500 text-sm">
                Supports: JPG, PNG, GIF, WebP
              </p>
            </div>
            <div className="mt-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                Select Image
              </button>
            </div>
          </div>
        )}
      </div>

      {result && <ResultCard result={result} />}
    </div>
  );
}

