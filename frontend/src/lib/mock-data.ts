import {
  ActivityItem,
  DashboardMetrics,
} from './types'

/* =========================
   Severity
========================= */

export const SEVERITY_LEVELS = [
  {
    value: 'P1-CRITICAL',
    label: 'P1 Critical',
    color: 'bg-red-600',
  },
  {
    value: 'P2-HIGH',
    label: 'P2 High',
    color: 'bg-orange-500',
  },
  {
    value: 'P3-MEDIUM',
    label: 'P3 Medium',
    color: 'bg-yellow-500',
  },
  {
    value: 'P4-LOW',
    label: 'P4 Low',
    color: 'bg-green-600',
  },
]

/* =========================
   Incident Categories
========================= */

export const INCIDENT_CATEGORIES = [
  'Database',
  'Network',
  'Application',
  'Infrastructure',
  'Security',
  'Cloud',
]

/* =========================
   Reflect Examples
========================= */

export const EXAMPLE_QUERIES = [
  'What are the most common database failures?',
  'What incident patterns occur most frequently?',
  'How can we reduce MTTR for production outages?',
  'What are the most effective resolutions used historically?',
  'Which service fails most often?',
  'Summarize recurring root causes.',
]

/* =========================
   Dashboard Placeholders
   (until backend metrics API exists)
========================= */

export const mockMetrics: DashboardMetrics = {
  totalIncidents: 0,

  hindsightMemories: 0,

  recallQueries: 0,

  reflectQueries: 0,

  diagnosesGenerated: 0,

  mentalModels: 0,
}

/* =========================
   Activity Feed Placeholders
========================= */

export const mockActivityFeed: ActivityItem[] = []

/* =========================
   Charts
========================= */

export const chartData = [
  {
    day: 'Mon',
    incidents: 0,
    diagnoses: 0,
  },
  {
    day: 'Tue',
    incidents: 0,
    diagnoses: 0,
  },
  {
    day: 'Wed',
    incidents: 0,
    diagnoses: 0,
  },
  {
    day: 'Thu',
    incidents: 0,
    diagnoses: 0,
  },
  {
    day: 'Fri',
    incidents: 0,
    diagnoses: 0,
  },
  {
    day: 'Sat',
    incidents: 0,
    diagnoses: 0,
  },
  {
    day: 'Sun',
    incidents: 0,
    diagnoses: 0,
  },
]

/* =========================
   RCA Distribution
========================= */

export const failureCategoriesData = [
  {
    name: 'Database',
    value: 0,
  },
  {
    name: 'Network',
    value: 0,
  },
  {
    name: 'Application',
    value: 0,
  },
  {
    name: 'Infrastructure',
    value: 0,
  },
  {
    name: 'Security',
    value: 0,
  },
]

/* =========================
   Severity Distribution
========================= */

export const severityDistributionData = [
  {
    name: 'P1 Critical',
    value: 0,
  },
  {
    name: 'P2 High',
    value: 0,
  },
  {
    name: 'P3 Medium',
    value: 0,
  },
  {
    name: 'P4 Low',
    value: 0,
  },
]