import { ButtonGroup, Loading } from '@geist-ui/react'
import React from 'react'
import { useHash } from 'react-use'
import FilesTable from '../components/FileTable'
import { usePathQuery } from '../utils/path'
import UploadFileButton from '../components/UploadFileButton'
import CreateDirectoryButton from '../components/CreateDirectoryButton'
import EmptyState from '../components/EmptyState'
import SearchButton from '../components/SearchButton'
import { usePath } from '../utils/hooks'

const Home = () => {
  const [path] = usePath()

  const { files, error, isLoading, isError } = usePathQuery(path)

  const isEmpty = !files || files.length === 0

  const sortedFiles: HdfsFile[] = React.useMemo(
    () => isEmpty ? [] : sortFiles(files),
    [files, isEmpty]
  )

  function sortFiles(files: HdfsFile[]) {
    return files.sort((a, b) => {
      if (a.type === b.type) return a.modTime - b.modTime
      else if (a.type === 'dir') return -1
      else if (a.type === 'file') return 1
      return 0
    })
  }

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl">我的文件</h1>
        <ButtonGroup>
          <UploadFileButton />
          <CreateDirectoryButton />
          <SearchButton />
        </ButtonGroup>
      </div>
      <FilesTable data={sortedFiles} />
      {isLoading ? <Loading className="!mt-12" /> : null}
      {isError ? (
        <div className="mt-4 text-sm text-red-600">
          {(error as any).message}
        </div>
      ) : null}
      {isEmpty && !isLoading ? <EmptyState /> : null}
    </div>
  )
}

export default Home
