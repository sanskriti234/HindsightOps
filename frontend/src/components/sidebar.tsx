'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import {
  Brain,
  BarChart3,
  AlertTriangle,
  Zap,
  Database,
  MessageSquare,
  Activity,
  Menu,
} from 'lucide-react'

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },

  // {
  //   label: 'Incident Memory',
  //   href: '/dashboard/incidents',
  //   icon: Database,
  // },

  // {
  //   label: 'AI Diagnosis',
  //   href: '/dashboard/diagnosis',
  //   icon: Brain,
  // },

  {
    label: 'Reflect Insights',
    href: '/dashboard/reflect',
    icon: Zap,
  },

  // {
  //   label: 'Mental Models',
  //   href: '/dashboard/models',
  //   icon: Database,
  // },

  // {
  //   label: 'System Health',
  //   href: '/dashboard/system',
  //   icon: Activity,
  // },
]

export default function Sidebar() {

  const pathname =
    usePathname()

  const [collapsed, setCollapsed] =
    useState(false)

  return (

    <aside
      className={`
        ${
          collapsed
            ? 'w-20'
            : 'w-72'
        }
        bg-sidebar
        border-r
        border-sidebar-border
        transition-all
        duration-300
        flex
        flex-col
      `}
    >

      {/* Logo */}

      <div
        className="
          border-b
          border-sidebar-border
          p-4
        "
      >

        <div className="flex items-center justify-between">

          <Link
            href="/"
            className="flex items-center gap-3"
          >

            <div
              className="
                h-10
                w-10
                rounded-lg
                bg-primary
                flex
                items-center
                justify-center
              "
            >

              <Brain className="h-5 w-5 text-white" />

            </div>

            {!collapsed && (

              <div>

                <div className="font-bold text-lg">

                  HindsightOps

                </div>

                <div className="text-xs text-muted-foreground">

                  Incident Intelligence

                </div>

              </div>

            )}

          </Link>

          <button
            onClick={() =>
              setCollapsed(
                !collapsed
              )
            }
            className="
              p-2
              rounded-lg
              hover:bg-sidebar-accent
            "
          >

            <Menu className="h-5 w-5" />

          </button>

        </div>

      </div>

      {/* Navigation */}

      <nav
        className="
          flex-1
          p-4
          space-y-2
        "
      >

        {navigationItems.map(
          (item) => {

            const active =
              pathname ===
              item.href

            const Icon =
              item.icon

            return (

              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-4
                  py-3
                  transition-colors
                  ${
                    active
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'hover:bg-sidebar-accent'
                  }
                `}
              >

                <Icon
                  className="
                    h-5
                    w-5
                    shrink-0
                  "
                />

                {!collapsed && (

                  <span className="text-sm font-medium">

                    {item.label}

                  </span>

                )}

              </Link>

            )
          }
        )}

      </nav>

      {/* Footer */}

      <div
        className="
          border-t
          border-sidebar-border
          p-4
        "
      >

        {!collapsed ? (

          <div className="space-y-2">

            <div className="flex items-center gap-2 text-xs">

              <Database className="h-4 w-4 text-primary" />

              <span>
                Hindsight Connected
              </span>

            </div>

            <div className="flex items-center gap-2 text-xs">

              <Brain className="h-4 w-4 text-primary" />

              <span>
                OpenRouter AI Enabled
              </span>

            </div>

            <div className="flex items-center gap-2 text-xs">

              <AlertTriangle className="h-4 w-4 text-yellow-500" />

              <span>
                Incident Memory Active
              </span>

            </div>

          </div>

        ) : (

          <div className="flex justify-center">

            <Brain className="h-5 w-5 text-primary" />

          </div>

        )}

      </div>

    </aside>

  )
}