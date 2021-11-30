import { QueryCache, QueryClient } from 'react-query'

const BASE_URL = process.env.REACT_APP_API_URL

export const queryClient = new QueryClient()
export const queryCache = new QueryCache()

export type ClientConfig = {
  data: any
  headers: RequestInit['headers']
  customConfig: RequestInit
}

export async function client(
  endpoint: string,
  {
    data,
    headers: customHeaders,
    customConfig,
  }: Partial<ClientConfig> = {}
) {
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      withCredentials: 'true',
      ...customHeaders,
    },
    ...customConfig,
  }

  return window
    .fetch(`${BASE_URL}/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}
