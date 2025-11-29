'use client'

import { Image as ImageIcon } from 'lucide-react'
import ImageScanner from '@/components/scanners/ImageScanner'

export default function ImageScanPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyber-blue/20 rounded-lg">
            <ImageIcon className="w-8 h-8 text-cyber-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Scan Image</h1>
            <p className="text-gray-400">Phát hiện hình ảnh lừa đảo và deepfake</p>
          </div>
        </div>
      </div>

      <ImageScanner />
    </div>
  )
}


