import type {
  Metadata,
  Viewport,
} from 'next'

import {
  Geist,
  Geist_Mono,
} from 'next/font/google'

import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'HindsightOps',
    template: '%s | HindsightOps',
  },

  description:
    'AI-powered incident intelligence platform using Hindsight memory, semantic recall, RCA generation, reflect insights, and mental models.',

  applicationName:
    'HindsightOps',

  keywords: [
    'Hindsight',
    'Incident Management',
    'Root Cause Analysis',
    'AI Operations',
    'DevOps',
    'SRE',
    'Semantic Memory',
    'LLM',
    'Observability',
  ],

  authors: [
    {
      name: 'HindsightOps Team',
    },
  ],

  creator: 'HindsightOps',

  openGraph: {
    title: 'HindsightOps',

    description:
      'AI-powered incident intelligence platform',

    type: 'website',

    siteName:
      'HindsightOps',
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'HindsightOps',

    description:
      'AI-powered incident intelligence platform',
  },

  icons: {
    icon: '/favicon.ico',

    apple:
      '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',

  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        dark
        ${geistSans.variable}
        ${geistMono.variable}
      `}
    >
      <body
        className="
          min-h-screen
          bg-background
          text-foreground
          antialiased
          font-sans
        "
      >
        {children}

      </body>
    </html>
  )
}