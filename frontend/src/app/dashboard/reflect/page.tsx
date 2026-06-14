'use client'

import { useState } from 'react'

import {
  Zap,
  Loader2,
  Copy,
  Check,
} from 'lucide-react'

import { api } from '@/lib/api'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const EXAMPLE_QUERIES = [
  'What are the most common database failures?',
  'Which services fail most often?',
  'What root causes appear repeatedly?',
  'What resolutions are most effective?',
  'What patterns exist in network outages?',
  'Which incidents had the longest recovery time?',
]

interface ReflectResponse {
  answer: {
    text: string

    usage?: {
      input_tokens: number
      output_tokens: number
      total_tokens: number
    }
  }
}

export default function ReflectPage() {
  const [query, setQuery] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(false)

  const [copied, setCopied] =
    useState(false)

  const [result, setResult] =
    useState<ReflectResponse | null>(
      null
    )

  const [generatedAt, setGeneratedAt] =
    useState<string | null>(null)

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsLoading(true)

    setResult(null)

    try {
      const response =
        await api.post<ReflectResponse>(
          '/agent/reflect',
          {
            query,
          }
        )

      setResult(response.data)

      setGeneratedAt(
        new Date().toISOString()
      )
    } catch (error: any) {
      console.error(error)

      alert(
        error?.response?.data
          ?.detail ??
          'Reflect query failed'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const copyResponse = async () => {
    if (!result?.answer?.text)
      return

    await navigator.clipboard.writeText(
      result.answer.text
    )

    setCopied(true)

    setTimeout(
      () => setCopied(false),
      2000
    )
  }

  return (
    <div className="p-8 space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Reflect Insights
        </h1>

        <p className="text-muted-foreground">
          Generate knowledge and
          organizational learning from
          Hindsight memory.
        </p>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT PANEL */}

        <div className="space-y-6">

          <form
            onSubmit={handleSubmit}
            className="border rounded-lg p-6 space-y-4"
          >

            <label className="text-sm font-medium">

              Ask Hindsight

            </label>

            <textarea
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              rows={5}
              placeholder="What are the most common database failures?"
              className="w-full border rounded-lg p-4"
            />

            <Button
              type="submit"
              disabled={
                !query.trim() ||
                isLoading
              }
              className="w-full"
            >

              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reflecting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Insight
                </>
              )}

            </Button>

          </form>

          <div className="border rounded-lg p-6">

            <h3 className="font-semibold mb-4">
              Example Queries
            </h3>

            <div className="space-y-2">

              {EXAMPLE_QUERIES.map(
                (example) => (
                  <button
                    key={example}
                    onClick={() =>
                      setQuery(
                        example
                      )
                    }
                    className="w-full text-left p-3 rounded border hover:bg-muted/20 transition"
                  >
                    {example}
                  </button>
                )
              )}

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="lg:col-span-2">

          {!result && (

            <div className="border rounded-lg p-12 text-center min-h-125 flex flex-col justify-center">

              <Zap className="w-16 h-16 mx-auto opacity-30 mb-4" />

              <p className="text-muted-foreground">

                Ask a question to generate
                insights from Hindsight
                Reflect.

              </p>

            </div>

          )}

          {result && (

            <div className="space-y-6">

              {/* Insight */}

              <div className="border rounded-lg p-6">

                <div className="flex justify-between items-center mb-4">

                  <h3 className="font-semibold text-lg">

                    Generated Insight

                  </h3>

                  <button
                    onClick={
                      copyResponse
                    }
                  >

                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}

                  </button>

                </div>

                <div className="whitespace-pre-wrap text-sm leading-relaxed">

                  {
                    result.answer.text
                  }

                </div>

              </div>

              {/* Token Usage */}

              {result.answer
                ?.usage && (

                <div className="border rounded-lg p-6">

                  <h3 className="font-semibold mb-4">

                    Token Usage

                  </h3>

                  <div className="grid grid-cols-3 gap-4">

                    <div>

                      <p className="text-xs text-muted-foreground uppercase">

                        Input

                      </p>

                      <p className="text-2xl font-bold text-primary">

                        {
                          result.answer
                            .usage
                            .input_tokens
                        }

                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-muted-foreground uppercase">

                        Output

                      </p>

                      <p className="text-2xl font-bold">

                        {
                          result.answer
                            .usage
                            .output_tokens
                        }

                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-muted-foreground uppercase">

                        Total

                      </p>

                      <p className="text-2xl font-bold">

                        {
                          result.answer
                            .usage
                            .total_tokens
                        }

                      </p>

                    </div>

                  </div>

                </div>

              )}

              {/* Generated At */}

              <div className="border rounded-lg p-6">

                <p className="text-xs uppercase text-muted-foreground mb-2">

                  Generated At

                </p>

                <p>

                  {generatedAt
                    ? new Date(
                        generatedAt
                      ).toLocaleString()
                    : '-'}

                </p>

              </div>

              {/* Raw Response */}

              <details className="border rounded-lg p-4">

                <summary className="cursor-pointer font-medium">

                  View Raw Response

                </summary>

                <pre className="mt-4 text-xs overflow-auto">

                  {JSON.stringify(
                    result,
                    null,
                    2
                  )}

                </pre>

              </details>

              {/* Hindsight Badges */}

              <div className="flex justify-center gap-2 flex-wrap">

                <Badge variant="secondary">
                  Hindsight Reflect
                </Badge>

                <Badge variant="secondary">
                  Knowledge Synthesis
                </Badge>

                <Badge className="bg-primary/20 text-primary">
                  Organizational Learning
                </Badge>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}