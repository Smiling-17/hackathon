'use client'

import { Mic } from 'lucide-react'
import AudioScanner from '@/components/scanners/AudioScanner'

export default function AudioScanPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyber-red/20 rounded-lg">
            <Mic className="w-8 h-8 text-cyber-red" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Scan Audio</h1>
            <p className="text-gray-400">Phân tích file âm thanh để phát hiện giọng nói giả mạo</p>
          </div>
        </div>
      </div>

      <AudioScanner />
    </div>
  )
}


