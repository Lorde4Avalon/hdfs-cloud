import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useAuth } from '../context/auth-context'
import { client, queryCache } from './api-client'

const getPathConfig = (path: string) => ({
  queryKey: path,
  queryFn: () => client(`/path?path=${encodeURIComponent(path)}`),
})

export function usePathQuery(path: string) {
  const { user } = useAuth()
  const result = useQuery(getPathConfig(`${user!.username}/` + path))
  return { ...result, files: result.data }
}
