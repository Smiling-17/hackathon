'use client'

import { Phone } from 'lucide-react'
import PhoneChecker from '@/components/tools/PhoneChecker'

export default function PhoneCheckPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyber-blue/20 rounded-lg">
            <Phone className="w-8 h-8 text-cyber-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Phone Checker</h1>
            <p className="text-gray-400">Kiểm tra số điện thoại có bị báo cáo spam hoặc lừa đảo</p>
          </div>
        </div>
      </div>

      <PhoneChecker />
    </div>
  )
}


