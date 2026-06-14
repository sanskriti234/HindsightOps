'use client'

import { useState } from 'react'
import {
  Brain,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

import { api } from '@/lib/api'

import {
  DiagnosisResponse,
  DiagnoseRequest,
} from '@/lib/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const INCIDENT_CATEGORIES = [
  'Database',
  'Network',
  'Application',
  'Infrastructure',
  'Security',
  'Cloud',
]

const SEVERITY_LEVELS = [
  'P1-CRITICAL',
  'P2-HIGH',
  'P3-MEDIUM',
  'P4-LOW',
]

const SERVICES = [
  'postgres',
  'redis',
  'kafka',
  'api-gateway',
  'user-service',
  'payment-service',
  'auth-service',
]

export default function DiagnosisPage() {
  const [isLoading, setIsLoading] =
    useState(false)

  const [result, setResult] =
    useState<DiagnosisResponse | null>(
      null
    )

  const [formData, setFormData] =
    useState({
      summary: '',
      category: '',
      symptoms: '',
      severity: '',
      services: [] as string[],
    })

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleServiceChange = (
    service: string
  ) => {
    setFormData((prev) => ({
      ...prev,

      services:
        prev.services.includes(
          service
        )
          ? prev.services.filter(
              (s) =>
                s !== service
            )
          : [
              ...prev.services,
              service,
            ],
    }))
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    setIsLoading(true)

    setResult(null)

    try {
      const payload: DiagnoseRequest =
        {
          incident_id:
            `INC-2026-${Math.floor(
              1000 +
                Math.random() *
                  9000
            )}`,

          category:
            formData.category,

          incident_summary:
            formData.summary,

          root_cause:
            'Unknown',

          resolution:
            'Pending',

          postmortem:
            'Pending',

          severity:
            formData.severity as DiagnoseRequest['severity'],

          service:
            formData.services,

          symptoms:
            formData.symptoms
              .split(/[\n,]+/)
              .map((s) =>
                s.trim()
              )
              .filter(Boolean),
        }

      const response =
        await api.post<DiagnosisResponse>(
          '/incidents/diagnose',
          payload
        )

      setResult(response.data)
    } catch (error: any) {
      console.error(error)

      alert(
        error?.response?.data
          ?.detail ??
          'Diagnosis failed'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const confidenceColor = (
    score: number
  ) => {
    if (score > 0.8)
      return 'text-green-500'

    if (score > 0.6)
      return 'text-yellow-500'

    return 'text-red-500'
  }

  const isFormValid =
    formData.summary &&
    formData.category &&
    formData.symptoms &&
    formData.severity &&
    formData.services.length > 0

  return (
    <div className="p-8 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          AI Diagnosis
        </h1>

        <p className="text-muted-foreground">
          Root Cause Analysis powered
          by Hindsight Memory
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        <div>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4 border rounded-lg p-6"
          >

            <textarea
              name="summary"
              rows={3}
              placeholder="Incident summary..."
              value={
                formData.summary
              }
              onChange={
                handleInputChange
              }
              className="w-full border rounded p-3"
            />

            <select
              name="category"
              value={
                formData.category
              }
              onChange={
                handleInputChange
              }
              className="w-full border rounded p-3"
            >
              <option value="">
                Select Category
              </option>

              {INCIDENT_CATEGORIES.map(
                (
                  category
                ) => (
                  <option
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {category}
                  </option>
                )
              )}
            </select>

            <textarea
              name="symptoms"
              rows={4}
              placeholder="Symptoms..."
              value={
                formData.symptoms
              }
              onChange={
                handleInputChange
              }
              className="w-full border rounded p-3"
            />

            <div className="space-y-2">

              {SERVICES.map(
                (
                  service
                ) => (
                  <label
                    key={
                      service
                    }
                    className="flex gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(
                        service
                      )}
                      onChange={() =>
                        handleServiceChange(
                          service
                        )
                      }
                    />

                    {service}
                  </label>
                )
              )}

            </div>

            <select
              name="severity"
              value={
                formData.severity
              }
              onChange={
                handleInputChange
              }
              className="w-full border rounded p-3"
            >
              <option value="">
                Select Severity
              </option>

              {SEVERITY_LEVELS.map(
                (
                  severity
                ) => (
                  <option
                    key={
                      severity
                    }
                    value={
                      severity
                    }
                  >
                    {severity}
                  </option>
                )
              )}
            </select>

            <Button
              className="w-full"
              disabled={
                !isFormValid ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Diagnosing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate RCA
                </>
              )}
            </Button>

          </form>

        </div>

        <div className="lg:col-span-2">

          {!result && (
            <div className="border rounded-lg p-12 text-center">

              <Brain className="mx-auto h-12 w-12 opacity-30 mb-4" />

              <p className="text-muted-foreground">
                Submit an incident to
                generate RCA using
                Hindsight Recall +
                OpenRouter
              </p>

            </div>
          )}

          {result && (

            <div className="space-y-6">

              <div className="border rounded-lg p-4">

                <div className="flex items-center justify-between text-xs text-muted-foreground">

                  <span>
                    Incident
                  </span>

                  <span>
                    →
                  </span>

                  <span>
                    Hindsight Recall
                  </span>

                  <span>
                    →
                  </span>

                  <span>
                    Historical Memory
                  </span>

                  <span>
                    →
                  </span>

                  <span>
                    OpenRouter
                  </span>

                  <span>
                    →
                  </span>

                  <span className="text-primary font-semibold">
                    RCA Generated
                  </span>

                </div>

              </div>

              <div className="border rounded-lg p-6">

                <h3 className="font-semibold flex gap-2 items-center mb-3">

                  <CheckCircle className="h-5 w-5 text-green-500" />

                  Diagnosis

                </h3>

                <p>
                  {
                    result.diagnosis
                  }
                </p>

              </div>

              <div className="border rounded-lg p-6">

                <div className="flex justify-between">

                  <span>
                    Confidence
                  </span>

                  <span
                    className={confidenceColor(
                      result.confidence_score
                    )}
                  >
                    {Math.round(
                      result.confidence_score *
                        100
                    )}
                    %
                  </span>

                </div>

              </div>

              <div className="border rounded-lg p-6">

                <h3 className="font-semibold mb-2">
                  AI Rationale
                </h3>

                <p className="whitespace-pre-wrap">
                  {
                    result.rationale
                  }
                </p>

              </div>

              <div className="border rounded-lg p-6">

                <h3 className="font-semibold mb-2">
                  Recommended Resolution
                </h3>

                <p className="whitespace-pre-wrap">
                  {result.recommended_resolution ??
                    'No recommendation generated'}
                </p>

              </div>

              <div className="border rounded-lg p-6">

                <h3 className="font-semibold mb-4">
                  Historical Matches
                </h3>

                <p className="mb-4">
                  {
                    result.historical_matches
                  }{' '}
                  memories retrieved
                  from Hindsight
                </p>

                <div className="space-y-2">

                  {result.source_incident_ids
                    ?.length >
                  0 ? (
                    result.source_incident_ids.map(
                      (
                        id
                      ) => (
                        <div
                          key={
                            id
                          }
                          className="p-2 rounded border font-mono"
                        >
                          {id}
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-muted-foreground">
                      No matching
                      incidents
                    </div>
                  )}

                </div>

              </div>

              <details className="border rounded-lg p-4">

                <summary className="cursor-pointer font-medium">

                  View Raw API Response

                </summary>

                <pre className="mt-4 text-xs overflow-auto">

                  {JSON.stringify(
                    result,
                    null,
                    2
                  )}

                </pre>

              </details>

              <div className="flex justify-center gap-2 flex-wrap">

                <Badge variant="secondary">
                  Hindsight Recall
                </Badge>

                <Badge variant="secondary">
                  {
                    result.historical_matches
                  }{' '}
                  Memories
                </Badge>

                <Badge className="bg-primary/20 text-primary">
                  OpenRouter RCA
                </Badge>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}