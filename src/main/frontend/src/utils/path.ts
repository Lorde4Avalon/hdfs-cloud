import { useQuery } from 'react-query'
import { useAuth } from '../context/auth-context'
import { client } from './api-client'

const getPathConfig = (path: string) => ({
  queryKey: path,
  queryFn: () => client(`/path?path=${encodeURIComponent(path)}`),
})

export function usePathQuery(path: string) {
  const { user } = useAuth()
  const result = useQuery(getPathConfig(`${user!.username}/` + path))
  return { ...result, files: result.data }
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
