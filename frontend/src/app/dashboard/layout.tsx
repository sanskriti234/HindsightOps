import type { ReactNode } from 'react'

import Sidebar from '@/components/sidebar'
import Header from '@/components/header'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="flex flex-1 flex-col overflow-hidden">

        <Header />

        <main
          className="
            flex-1
            overflow-y-auto
            bg-background
          "
        >
          {children}
        </main>

      </div>

    </div>
  )
}