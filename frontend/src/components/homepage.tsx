'use client'

import Link from 'next/link'

import {
  ArrowRight,
  Brain,
  Database,
  Search,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">

        <div className="container mx-auto flex h-16 items-center justify-between px-6">

          <div className="flex items-center gap-3">

            <Brain className="h-7 w-7 text-primary" />

            <span className="text-xl font-bold">
              HindsightOps
            </span>

          </div>

          <div className="flex items-center gap-4">

            <Link href="/dashboard">
              <Button>
                Launch Dashboard
              </Button>
            </Link>

          </div>

        </div>

      </nav>

      {/* HERO */}

      <section className="container mx-auto px-6 py-24">

        <div className="max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-6">

            <Brain className="h-4 w-4 text-primary" />

            <span className="text-sm">
              Powered by Hindsight Memory
            </span>

          </div>

          <h1 className="text-6xl font-bold tracking-tight mb-6">

            Incident Response
            <br />

            That Actually Learns

          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">

            Store incidents, recall historical failures,
            generate organizational insights,
            build mental models,
            and diagnose outages using AI.

          </p>

          <div className="flex justify-center gap-4">

            <Link href="/dashboard">

              <Button size="lg">

                Launch Dashboard

                <ArrowRight className="ml-2 h-4 w-4" />

              </Button>

            </Link>

          </div>

        </div>

      </section>

      {/* ARCHITECTURE */}

      <section className="container mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold text-center mb-12">

          How HindsightOps Works

        </h2>

        <div className="grid md:grid-cols-6 gap-4">

          <Step
            icon={<Database />}
            title="Store"
            description="Incidents stored in Hindsight"
          />

          <Step
            icon={<Search />}
            title="Recall"
            description="Retrieve similar incidents"
          />

          <Step
            icon={<Brain />}
            title="Memory"
            description="Build RCA context"
          />

          <Step
            icon={<Sparkles />}
            title="Reflect"
            description="Generate insights"
          />

          <Step
            icon={<ShieldCheck />}
            title="Mental Models"
            description="Organizational knowledge"
          />

          <Step
            icon={<Brain />}
            title="Diagnose"
            description="AI Root Cause Analysis"
          />

        </div>

      </section>

      {/* FEATURES */}

      <section className="container mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold text-center mb-12">

          Platform Features

        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <FeatureCard
            title="Incident Memory"
            description="Store every incident in Hindsight."
          />

          <FeatureCard
            title="Semantic Recall"
            description="Find similar outages instantly."
          />

          <FeatureCard
            title="Reflect Insights"
            description="Generate knowledge from historical incidents."
          />

          <FeatureCard
            title="Mental Models"
            description="Living operational playbooks."
          />

        </div>

      </section>

      {/* CTA */}

      <section className="container mx-auto px-6 py-24 text-center">

        <h2 className="text-4xl font-bold mb-4">

          Stop Solving The Same Incident Twice

        </h2>

        <p className="text-muted-foreground mb-8">

          Turn every outage into reusable knowledge.

        </p>

        <Link href="/dashboard">

          <Button size="lg">

            Open HindsightOps

          </Button>

        </Link>

      </section>

    </div>
  )
}

function Step({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border p-6 text-center">
      <div className="flex justify-center mb-4 text-primary">
        {icon}
      </div>

      <h3 className="font-semibold mb-2">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border p-6">

      <h3 className="font-semibold mb-2">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground">
        {description}
      </p>

    </div>
  )
}