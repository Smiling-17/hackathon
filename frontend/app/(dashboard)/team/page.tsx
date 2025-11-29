'use client'

import { Users, Shield } from 'lucide-react'

export default function TeamPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-cyber-blue/20 rounded-lg">
            <Users className="w-8 h-8 text-cyber-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Đội ngũ phát triển</h1>
            <p className="text-gray-400">Thông tin về các thành viên trong team</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 hover:border-cyber-blue/30 transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyber-blue/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-blue/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-cyber-blue">TQV</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyber-blue transition-colors">
                  Trần Quang Vinh
                </h3>
                <p className="text-gray-400 text-sm">Frontend Lead & Base</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-cyber-blue" />
                <span>UI/UX Design & Frontend Development</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-cyber-blue" />
                <span>Navigation & Layout System</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyber-red/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-red/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-cyber-red">NTD</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyber-red transition-colors">
                  Nguyễn Tiến Dũng
                </h3>
                <p className="text-gray-400 text-sm">AI Core Specialist</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-cyber-red" />
                <span>AI Scanner Components</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Shield className="w-4 h-4 text-cyber-red" />
                <span>API Routes & Groq Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


