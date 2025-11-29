'use client';

import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ResultCardProps {
  result: {
    status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO';
    title: string;
    message: string;
    confidence?: number;
  };
}

export default function ResultCard({ result }: ResultCardProps) {
  if (!result) {
    return null;
  }

  const statusConfig = {
    DANGER: {
      bg: 'bg-red-950/50',
      border: 'border-red-500',
      text: 'text-red-400',
      icon: AlertCircle,
    },
    SAFE: {
      bg: 'bg-green-950/50',
      border: 'border-green-500',
      text: 'text-green-400',
      icon: CheckCircle,
    },
    WARNING: {
      bg: 'bg-yellow-950/50',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      icon: AlertTriangle,
    },
    INFO: {
      bg: 'bg-blue-950/50',
      border: 'border-blue-500',
      text: 'text-blue-400',
      icon: Info,
    },
  };

  const config = statusConfig[result.status];
  if (!config) {
    // Fallback for unknown status
    return null;
  }

  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border-2 rounded-lg p-6 mt-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`${config.text} w-6 h-6 flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`${config.text} font-bold text-lg mb-2`}>
            {result.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {result.message}
          </p>
          {result.confidence !== undefined && (
            <p className={`${config.text} text-xs mt-3 opacity-75`}>
              Confidence: {result.confidence}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

