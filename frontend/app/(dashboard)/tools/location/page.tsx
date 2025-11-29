'use client'

import { MapPin } from 'lucide-react'
import LocationChecker from '@/components/tools/LocationChecker'

export default function LocationCheckPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyber-red/20 rounded-lg">
            <MapPin className="w-8 h-8 text-cyber-red" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Location Checker</h1>
            <p className="text-gray-400">Kiểm tra mức độ an toàn của vị trí hiện tại</p>
          </div>
        </div>
      </div>

      <LocationChecker />
    </div>
  )
}


