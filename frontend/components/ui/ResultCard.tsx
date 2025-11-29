'use client'

import { AlertTriangle, CheckCircle, Info, Shield } from 'lucide-react'

interface ResultCardProps {
  result: {
    status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO'
    title: string
    message: string
    confidence?: number
  }
}

export default function ResultCard({ result }: ResultCardProps) {
  const { status, title, message, confidence } = result

  const statusConfig = {
    DANGER: {
      bg: 'bg-red-950/50',
      border: 'border-red-500',
      text: 'text-red-400',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
    },
    SAFE: {
      bg: 'bg-green-950/50',
      border: 'border-green-500',
      text: 'text-green-400',
      icon: CheckCircle,
      iconColor: 'text-green-500',
    },
    WARNING: {
      bg: 'bg-yellow-950/50',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
    },
    INFO: {
      bg: 'bg-blue-950/50',
      border: 'border-blue-500',
      text: 'text-blue-400',
      icon: Info,
      iconColor: 'text-blue-500',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={`${config.bg} ${config.border} border-2 rounded-lg p-6 shadow-lg shadow-${status.toLowerCase()}-500/20`}
    >
      <div className="flex items-start gap-4">
        <Icon className={`${config.iconColor} w-8 h-8 flex-shrink-0`} />
        <div className="flex-1">
          <h3 className={`${config.text} text-xl font-bold mb-2`}>{title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
          {confidence !== undefined && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Confidence</span>
                <span className={`${config.text} text-sm font-semibold`}>
                  {confidence}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`${config.bg.replace('/50', '')} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



