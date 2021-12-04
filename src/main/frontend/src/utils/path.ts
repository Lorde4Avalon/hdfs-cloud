import React from 'react'
import { QueryOptions, useQuery } from 'react-query'
import { client, queryCache, queryClient } from './api-client'

export const getPathQueryConfig = (path: string) => ({
  queryKey: ['pathQuery', path],
  queryFn: () => client(`/path?path=${encodeURIComponent(path)}`),
} as QueryOptions)

export function usePathQuery(path: string) {
  const result = useQuery(getPathQueryConfig(path))
  return { ...result, files: result.data as HdfsFile[] }
}

export function downloadFile(path: string) {
  const url = `/download?path=${encodeURIComponent(path)}`
  return client(url).then((data) => {
    const downloadURL = window.URL.createObjectURL(data)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = downloadURL
    a.download = path.substring(path.lastIndexOf('/') + 1)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(downloadURL)
  })
}

const getFileSearchConfig = (beginPath: string, key: string) =>
  ({
    queryKey: ['fileSearch', beginPath, key],
    queryFn: () => client(`search?beginPath=${beginPath}&key=${key}`),
    enabled: Boolean(key),
    retry: false,
    cacheTime: 0,
  } as QueryOptions)

export function useFileSearch(beginPath: string, key: string) {
  const result = useQuery(getFileSearchConfig(beginPath, key))
  return { ...result, files: result.data as HdfsFile[] }
}
