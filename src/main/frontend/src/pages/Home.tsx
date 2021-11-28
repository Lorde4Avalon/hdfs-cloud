import { Button, Loading } from '@geist-ui/react'
import React, { useEffect, useLayoutEffect } from 'react'
import { useHash } from 'react-use'
import FilesTable from '../components/FileTable'
import { usePathQuery } from '../utils/path'
import Upload from 'rc-upload'
import UploadFile from '../components/UploadFile'

const Home = () => {
  const [hash, setHash] = useHash()
  const [path, setPath] = React.useState<string>(
    hash ? hash.substring(1) : '/'
  )

  const { files, error, isLoading, isError, isSuccess } =
    usePathQuery(path)

  const updatePath = (path: string) => (
    setPath(path), setHash(`#${path}`)
  )

  return (
    <div>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl">我的文件</h1>
        <UploadFile />
      </div>
      <FilesTable data={files} updatePath={updatePath} />
      {isLoading ? <Loading className="!mt-12" /> : null}
      {isError ? (
        <div className="mt-4 text-sm text-red-600">
          {(error as any).message}
        </div>
      ) : null}
    </div>
  )
}

export default Home
