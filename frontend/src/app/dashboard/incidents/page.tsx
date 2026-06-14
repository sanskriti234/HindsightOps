'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

import { api } from '@/lib/api'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const INCIDENT_CATEGORIES = [
  'Database',
  'Network',
  'Application',
  'Infrastructure',
  'Security',
  'Cloud',
]

const SEVERITY_LEVELS = [
  {
    value: 'P1-CRITICAL',
    label: 'Critical',
    color: 'bg-red-600',
  },
  {
    value: 'P2-HIGH',
    label: 'High',
    color: 'bg-orange-500',
  },
  {
    value: 'P3-MEDIUM',
    label: 'Medium',
    color: 'bg-yellow-500',
  },
  {
    value: 'P4-LOW',
    label: 'Low',
    color: 'bg-green-600',
  },
]

interface IncidentMemory {
  incident_id: string
  memory: string
  score: number

  metadata: {
    category?: string
    severity?: string
    services?: string | string[]
    timestamp?: string
  }
}

export default function IncidentsPage() {
  const [incidents, setIncidents] =
    useState<IncidentMemory[]>([])

  const [loading, setLoading] =
    useState(false)

  const [searchQuery, setSearchQuery] =
    useState('')

  const [selectedSeverity, setSelectedSeverity] =
    useState('')

  const [selectedCategory, setSelectedCategory] =
    useState('')

  const [selectedIncident, setSelectedIncident] =
    useState<IncidentMemory | null>(null)

  const searchIncidents = async () => {
    try {
      setLoading(true)

      const response =
        await api.get('/incidents/search', {
          params: {
            category:
              selectedCategory ||
              'Database',

            symptoms:
              searchQuery ||
              'timeout',
          },
        })

      setIncidents(
        response.data.results || []
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchIncidents()
  }, [])

  const filteredIncidents =
    incidents.filter((incident) => {
      const matchesSeverity =
        !selectedSeverity ||
        incident.metadata?.severity ===
          selectedSeverity

      return matchesSeverity
    })

  const getSeverityColor = (
    severity?: string
  ) => {
    return (
      SEVERITY_LEVELS.find(
        (s) =>
          s.value === severity
      )?.color || 'bg-gray-600'
    )
  }

  return (
    <div className="p-8 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Incident Memory
        </h1>

        <p className="text-muted-foreground">
          Browse incidents stored in
          Hindsight long-term memory.
        </p>
      </div>

      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
        <p className="text-sm text-primary">
          Results are retrieved from
          Hindsight using semantic recall.
        </p>
      </div>

      <div className="space-y-4">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="flex-1 relative">

            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <input
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search symptoms..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-card"
            />

          </div>

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }
            className="px-4 py-2 rounded-lg border bg-card"
          >
            <option value="">
              All Categories
            </option>

            {INCIDENT_CATEGORIES.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) =>
              setSelectedSeverity(
                e.target.value
              )
            }
            className="px-4 py-2 rounded-lg border bg-card"
          >
            <option value="">
              All Severities
            </option>

            {SEVERITY_LEVELS.map(
              (severity) => (
                <option
                  key={
                    severity.value
                  }
                  value={
                    severity.value
                  }
                >
                  {severity.label}
                </option>
              )
            )}
          </select>

          <button
            onClick={searchIncidents}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
          >
            Search
          </button>

        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">

        <table className="w-full">

          <thead>
            <tr className="border-b">

              <th className="p-4 text-left">
                Incident ID
              </th>

              <th className="p-4 text-left">
                Memory Preview
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Severity
              </th>

              <th className="p-4 text-left">
                Services
              </th>

              <th className="p-4 text-left">
                Similarity
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center"
                >
                  Searching Hindsight...
                </td>
              </tr>
            )}

            {!loading &&
              filteredIncidents.length ===
                0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No memories found.
                  </td>
                </tr>
              )}

            {filteredIncidents.map(
              (incident) => (
                <tr
                  key={
                    incident.incident_id
                  }
                  className="border-b hover:bg-muted/20"
                >
                  <td className="p-4 font-mono text-primary">
                    {
                      incident.incident_id
                    }
                  </td>

                  <td className="p-4 max-w-md truncate">
                    {incident.memory?.slice(
                      0,
                      100
                    )}
                    ...
                  </td>

                  <td className="p-4">
                    {
                      incident.metadata
                        ?.category
                    }
                  </td>

                  <td className="p-4">
                    <Badge
                      className={getSeverityColor(
                        incident.metadata
                          ?.severity
                      )}
                    >
                      {
                        incident.metadata
                          ?.severity
                      }
                    </Badge>
                  </td>

                  <td className="p-4">
                    {Array.isArray(
                      incident.metadata
                        ?.services
                    )
                      ? incident.metadata.services.join(
                          ', '
                        )
                      : incident.metadata
                          ?.services}
                  </td>

                  <td className="p-4 text-primary font-semibold">
                    {incident.score}
                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        setSelectedIncident(
                          incident
                        )
                      }
                      className="px-3 py-1 rounded bg-primary/10 text-primary"
                    >
                      View
                    </button>

                  </td>
                </tr>
              )
            )}

          </tbody>
        </table>
      </div>

      <Dialog
        open={!!selectedIncident}
        onOpenChange={() =>
          setSelectedIncident(null)
        }
      >
        <DialogContent className="max-w-4xl">

          {selectedIncident && (
            <>
              <DialogHeader>

                <DialogTitle>
                  {
                    selectedIncident.incident_id
                  }
                </DialogTitle>

                <DialogDescription>
                  Retrieved from Hindsight
                  Memory
                </DialogDescription>

              </DialogHeader>

              <div className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Category
                    </p>

                    <p>
                      {
                        selectedIncident
                          .metadata
                          ?.category
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Similarity Score
                    </p>

                    <p className="text-primary font-semibold">
                      {
                        selectedIncident.score
                      }
                    </p>
                  </div>

                </div>

                <div>

                  <p className="text-xs uppercase text-muted-foreground mb-2">
                    Incident Memory
                  </p>

                  <pre className="whitespace-pre-wrap text-sm border rounded p-4 bg-card">
                    {
                      selectedIncident.memory
                    }
                  </pre>

                </div>

                <Badge className="bg-primary/20 text-primary">
                  Stored in Hindsight Memory
                </Badge>

              </div>
            </>
          )}

        </DialogContent>
      </Dialog>

    </div>
  )
}