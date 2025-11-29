import Navbar from '@/components/navigation/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <main className="lg:ml-64 pt-16 lg:pt-0 flex-1">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <footer className="lg:ml-64 border-t border-slate-800 bg-slate-900/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 CyberGuard AI - Built for Hackathon
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm mb-1">Đội ngũ phát triển</p>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-xs text-gray-500">
                <span>Trần Quang Vinh</span>
                <span className="text-gray-600">•</span>
                <span>Nguyễn Tiến Dũng</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

