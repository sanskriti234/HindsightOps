export const NAVIGATION_ITEMS = [

  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'BarChart3',
  },

  {
    label: 'Incident Memory',
    href: '/dashboard/incidents',
    icon: 'AlertCircle',
  },

  {
    label: 'AI Diagnosis',
    href: '/dashboard/diagnosis',
    icon: 'Brain',
  },

  {
    label: 'Agent Chat',
    href: '/dashboard/agent',
    icon: 'MessageSquare',
  },

  {
    label: 'Reflect Insights',
    href: '/dashboard/reflect',
    icon: 'Zap',
  },

  {
    label: 'Mental Models',
    href: '/dashboard/models',
    icon: 'BookOpen',
  },
]

/* =========================
   Backend Endpoints
========================= */

export const API_ENDPOINTS = {

  HEALTH:
    '/health',

  STORE_INCIDENT:
    '/incidents/store',

  DIAGNOSE_INCIDENT:
    '/incidents/diagnose',

  SEARCH_INCIDENTS:
    '/incidents/search',

  AGENT_QUERY:
    '/agent/query',

  AGENT_REFLECT:
    '/agent/reflect',

  MENTAL_MODELS:
    '/mental-models',
}

/* =========================
   Branding
========================= */

export const APP_CONFIG = {

  name:
    'HindsightOps',

  version:
    '1.0.0',

  tagline:
    'AI-Powered Incident Intelligence',

  company:
    'HindsightOps',

  poweredBy:
    'Hindsight + OpenRouter',
}

/* =========================
   Hindsight Features
========================= */

export const HINDSIGHT_FEATURES = [

  'Memory Retention',

  'Semantic Recall',

  'Incident RCA',

  'AI Diagnosis',

  'Reflect Insights',

  'Mental Models',

  'Agent Reasoning',
]