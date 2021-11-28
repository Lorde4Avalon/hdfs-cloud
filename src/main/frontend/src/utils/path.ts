import { useQuery, useQueryClient } from "react-query";
import { client } from "./api-client";

const getPathConfig = (path: string) => ({
  queryKey: path,
  queryFn: () => client(`/path?path=${encodeURIComponent(path)}`)
})

export function usePathQuery(path: string) {
  const result = useQuery(getPathConfig(path))
  return { ...result, files: result.data }
}
