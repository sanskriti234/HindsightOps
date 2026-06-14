'use client'

import { useEffect, useState } from 'react'

import {
  Bell,
  Settings,
  Activity,
  Database,
} from 'lucide-react'

import { api } from '@/lib/api'

export default function Header() {

  const [health, setHealth] =
    useState<
      'healthy'
      | 'offline'
      | 'loading'
    >('loading')

  useEffect(() => {

    const checkHealth =
      async () => {

        try {

          const response =
            await api.get(
              '/health'
            )

          if (
            response.data
              ?.status ===
            'healthy'
          ) {

            setHealth(
              'healthy'
            )

          } else {

            setHealth(
              'offline'
            )

          }

        } catch {

          setHealth(
            'offline'
          )

        }

      }

    checkHealth()

    const interval =
      setInterval(
        checkHealth,
        30000
      )

    return () =>
      clearInterval(
        interval
      )

  }, [])

  return (

    <header
      className="
        border-b
        border-border
        bg-card/50
        backdrop-blur-md
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          px-8
          py-4
        "
      >

        {/* Left */}

        <div>

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            HindsightOps
          </h1>

          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            AI-Powered Incident
            Diagnosis &
            Organizational Memory
          </p>

        </div>

        {/* Right */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          {/* Backend Status */}

          <div
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              border
            "
          >

            <Activity
              className={`w-4 h-4 ${
                health ===
                'healthy'
                  ? 'text-green-500'
                  : health ===
                    'offline'
                  ? 'text-red-500'
                  : 'text-yellow-500'
              }`}
            />

            <span
              className="
                text-xs
                font-medium
              "
            >

              {health ===
                'healthy' &&
                'Backend Healthy'}

              {health ===
                'offline' &&
                'Backend Offline'}

              {health ===
                'loading' &&
                'Checking...'}

            </span>

          </div>

          {/* Hindsight Badge */}

          <div
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              border
              bg-primary/5
            "
          >

            <Database
              className="
                h-4
                w-4
                text-primary
              "
            />

            <span
              className="
                text-xs
                font-medium
                text-primary
              "
            >
              Hindsight Connected
            </span>

          </div>

          {/* Notifications */}

          <button
            className="
              p-2
              rounded-lg
              hover:bg-muted
              transition-colors
            "
          >

            <Bell
              className="
                w-5
                h-5
              "
            />

          </button>

          {/* Settings */}

          <button
            className="
              p-2
              rounded-lg
              hover:bg-muted
              transition-colors
            "
          >

            <Settings
              className="
                w-5
                h-5
              "
            />

          </button>

        </div>

      </div>

    </header>

  )
}