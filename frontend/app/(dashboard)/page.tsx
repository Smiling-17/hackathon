'use client'

import Image from 'next/image'
import { Shield, Image as ImageIcon, Mic, Video, Phone, MapPin, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

const featureCards = [
  {
    title: 'Scan Image',
    description: 'Phát hiện hình ảnh lừa đảo, deepfake, hoặc nội dung đáng ngờ',
    icon: ImageIcon,
    href: '/image',
    color: 'cyber-blue',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Scan Audio',
    description: 'Phân tích file âm thanh để phát hiện giọng nói giả mạo',
    icon: Mic,
    href: '/audio',
    color: 'cyber-red',
    gradient: 'from-red-500/20 to-pink-500/20',
  },
  {
    title: 'Scan Video',
    description: 'Phát hiện deepfake và video đã được chỉnh sửa',
    icon: Video,
    href: '/video',
    color: 'cyber-yellow',
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
]

const quickTools = [
  {
    title: 'Phone Checker',
    description: 'Kiểm tra số điện thoại có bị báo cáo spam',
    icon: Phone,
    href: '/tools/phone',
  },
  {
    title: 'Location Checker',
    description: 'Kiểm tra mức độ an toàn của vị trí hiện tại',
    icon: MapPin,
    href: '/tools/location',
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden drop-shadow-lg ring-4 ring-cyber-blue/20">
            <Image
              src="/images/logo.png"
              alt="CyberGuard AI Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          CyberGuard AI
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Hệ thống bảo vệ chống lừa đảo được hỗ trợ bởi AI
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Tổng lượt quét</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-white">12,847</div>
          <div className="text-sm text-green-500 mt-1">+18.3% so với tháng trước</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Phát hiện nguy hiểm</span>
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-white">342</div>
          <div className="text-sm text-red-500 mt-1">Cần xử lý ngay</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Độ chính xác</span>
            <TrendingUp className="w-5 h-5 text-cyber-blue" />
          </div>
          <div className="text-3xl font-bold text-white">96.8%</div>
          <div className="text-sm text-cyber-blue mt-1">AI Model v2.0</div>
        </div>
      </div>

      {/* Main Features */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyber-blue" />
          Tính năng chính
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-cyber-blue/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyber-blue/10"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
                <div className="mt-4 text-cyber-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Bắt đầu quét →
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Tools */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-cyber-blue" />
          Công cụ nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-cyber-blue/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-cyber-blue/20 transition-colors">
                    <Icon className="w-6 h-6 text-cyber-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyber-blue transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{tool.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

