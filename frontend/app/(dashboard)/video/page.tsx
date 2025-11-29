'use client'

import { Video } from 'lucide-react'
import VideoScanner from '@/components/scanners/VideoScanner'

export default function VideoScanPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyber-yellow/20 rounded-lg">
            <Video className="w-8 h-8 text-cyber-yellow" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Scan Video</h1>
            <p className="text-gray-400">Phát hiện deepfake và video đã được chỉnh sửa</p>
          </div>
        </div>
      </div>

      <VideoScanner />
    </div>
  )
}


