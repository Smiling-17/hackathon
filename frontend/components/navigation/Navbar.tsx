'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Image as ImageIcon,
  Mic,
  Video,
  Phone,
  MapPin,
  Home,
  Users,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Tổng quan hệ thống',
  },
  {
    name: 'Scan Image',
    href: '/image',
    icon: ImageIcon,
    description: 'Quét và phân tích hình ảnh',
  },
  {
    name: 'Scan Audio',
    href: '/audio',
    icon: Mic,
    description: 'Phân tích file âm thanh',
  },
  {
    name: 'Scan Video',
    href: '/video',
    icon: Video,
    description: 'Phát hiện deepfake video',
  },
  {
    name: 'Phone Checker',
    href: '/tools/phone',
    icon: Phone,
    description: 'Kiểm tra số điện thoại',
  },
  {
    name: 'Location Checker',
    href: '/tools/location',
    icon: MapPin,
    description: 'Kiểm tra vị trí an toàn',
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
    description: 'Đội ngũ phát triển',
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="CyberGuard AI Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">CyberGuard</h1>
              <p className="text-xs text-gray-400">AI Protection</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 animate-fadeIn ${
                  isActive
                    ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30 glow-cyber-blue'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-cyber-blue' : 'text-gray-400 group-hover:text-cyber-blue'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-gray-500 text-center">
            © 2024 CyberGuard AI
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 z-50">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="CyberGuard AI Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">CyberGuard</h1>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="relative w-8 h-8 flex-shrink-0 rounded-full overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="CyberGuard AI Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <h1 className="text-lg font-bold text-white">CyberGuard</h1>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                        : 'text-gray-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

