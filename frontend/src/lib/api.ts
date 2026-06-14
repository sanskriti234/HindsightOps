import axios from 'axios'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,

  timeout: 30000,

  headers: {
    'Content-Type':
      'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error(
      'API Error:',
      error?.response?.data ??
        error.message
    )

    return Promise.reject(error)
  }
)

/* -------------------------------- */
/* Health                           */
/* -------------------------------- */

export async function healthCheck() {
  const { data } =
    await api.get('/health')

  return data
}

/* -------------------------------- */
/* Incident Memory                  */
/* -------------------------------- */

export async function storeIncident(
  payload: any
) {
  const { data } =
    await api.post(
      '/incidents/store',
      payload
    )

  return data
}

export async function diagnoseIncident(
  payload: any
) {
  const { data } =
    await api.post(
      '/incidents/diagnose',
      payload
    )

  return data
}

export async function searchIncidents(
  category: string,
  symptoms: string
) {
  const { data } =
    await api.get(
      '/incidents/search',
      {
        params: {
          category,
          symptoms,
        },
      }
    )

  return data
}

/* -------------------------------- */
/* Agent                            */
/* -------------------------------- */

export async function queryAgent(
  query: string
) {
  const { data } =
    await api.post(
      '/agent/query',
      {
        query,
      }
    )

  return data
}

export async function reflect(
  query: string
) {
  const { data } =
    await api.post(
      '/agent/reflect',
      {
        query,
      }
    )

  return data
}

/* -------------------------------- */
/* Mental Models                    */
/* -------------------------------- */

export async function getMentalModels() {
  const { data } =
    await api.get(
      '/mental-models'
    )

  return data
}

export async function createMentalModel(
  name: string,
  sourceQuery: string
) {
  const { data } =
    await api.post(
      '/mental-models',
      {
        name,
        source_query:
          sourceQuery,
      }
    )

  return data
}

export async function getDashboardStats() {

  const res =
    await api.get(
      "/dashboard/stats"
    )

  return res.data
}