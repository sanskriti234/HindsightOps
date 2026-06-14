/* =========================
   Incident
========================= */

export interface Incident {

  incident_id: string

  category: string

  incident_summary: string

  root_cause: string

  resolution: string

  postmortem: string

  severity:
    | 'P1-CRITICAL'
    | 'P2-HIGH'
    | 'P3-MEDIUM'
    | 'P4-LOW'

  service: string[]

  symptoms: string[]

  logs?: string[]

  timestamp?: string

  status?: string

  reporter?: string

  tags?: string[]
}

/* =========================
   Diagnosis
========================= */

export interface DiagnoseRequest {

  incident_id: string

  category: string

  incident_summary: string

  root_cause: string

  resolution: string

  postmortem: string

  severity:
    | 'P1-CRITICAL'
    | 'P2-HIGH'
    | 'P3-MEDIUM'
    | 'P4-LOW'

  service: string[]

  symptoms: string[]
}

export interface DiagnosisResponse {

  diagnosis: string

  confidence_score: number

  rationale: string

  recommended_resolution?: string

  source_incident_ids: string[]

  historical_matches: number
}

/* =========================
   Incident Search
========================= */

export interface SearchResult {

  incident_id: string

  memory: string

  score: number

  metadata?: Record<
    string,
    any
  >
}

export interface SearchResponse {

  matches: number

  results: SearchResult[]
}

/* =========================
   Reflect
========================= */

export interface ReflectUsage {

  input_tokens: number

  output_tokens: number

  total_tokens: number
}

export interface ReflectAnswer {

  text: string

  usage?: ReflectUsage

  based_on?: any

  structured_output?: any
}

export interface ReflectResponse {

  answer: ReflectAnswer
}

/* =========================
   Agent
========================= */

export interface AgentRequest {
  query: string
}

export interface AgentResponse {

  answer: string

  sources?: string[]
}

/* =========================
   Mental Models
========================= */

export interface MentalModel {

  id: string

  name: string

  content: string

  created_at?: string

  updated_at?: string
}

export interface CreateMentalModelRequest {

  name: string

  source_query: string
}

/* =========================
   Dashboard
========================= */

export interface DashboardMetrics {

  totalIncidents: number

  hindsightMemories: number

  recallQueries: number

  reflectQueries: number

  diagnosesGenerated: number

  mentalModels: number
}

/* =========================
   Activity Feed
========================= */

export interface ActivityItem {

  id: string

  title: string

  description: string

  timestamp: string

  type:
    | 'incident'
    | 'recall'
    | 'diagnosis'
    | 'reflect'
    | 'mental-model'
}

/* =========================
   Health
========================= */

export interface HealthResponse {

  status: string
}