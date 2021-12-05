import { Button, Drawer, Tree, useToasts } from '@geist-ui/react'
import { Plus } from '@geist-ui/react-icons'
import { TreeFile as TreeFileType } from '@geist-ui/react/dist/tree/tree'
import React, { useRef } from 'react'
import { useAuth } from '../context/auth-context'
import { client, queryClient } from '../utils/api-client'
import { sortFiles } from '../utils/helper'
import { useAsync } from '../utils/hooks'
import { getPathQueryConfig, usePathQuery } from '../utils/path'
import TreeFile from './lib/TreeFile'
import TreeFolder from './lib/TreeFolder'

async function moveFile(
  username: string,
  oldPath: string,
  newPath: string
) {
  return client('path', {
    customConfig: {
      method: 'PUT',
    },
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      username,
      src: oldPath,
      dst: newPath,
    },
  })
}

interface MoveDrawerProps {
  targetFile: HdfsFile
  visible: boolean
  setVisible: (visible: boolean) => void
}

function MoveModal({
  targetFile,
  visible,
  setVisible,
}: MoveDrawerProps) {
  const { run: runLoadFiles, isLoading: isLoadingFiles } = useAsync()
  const { run: runMoveFile, isLoading: isMovingFile } = useAsync()
  const queryPath = useRef('')
  const currentSelected = useRef<HdfsTreeFile | null>()
  const [, setToast] = useToasts()
  const { user } = useAuth()

  const [treeFiles, setTreeFiles] = React.useState<HdfsTreeFile[]>(
    () => [
      {
        type: 'directory',
        name: '我的文件',
        files: undefined,
        path: '/',
        indexPath: [0],
      },
    ]
  )

  type HdfsTreeFile = TreeFileType & {
    path: string
    indexPath: number[]
    files?: HdfsTreeFile[]
  }

  function parseHdfsFiles2TreeFiles(
    files: HdfsFile[],
    parentIndexPath: number[]
  ): HdfsTreeFile[] {
    if (!files || files.length === 0) return []
    return files.map((file, index) => {
      const type = file.type === 'dir' ? 'directory' : 'file'
      return {
        name: file.name,
        type,
        files: undefined,
        path: file.path,
        indexPath: [...parentIndexPath, index],
      }
    })
  }

  function close() {
    currentSelected.current = null
    setVisible(false)
  }

  async function handleDirectoryClick(file: HdfsTreeFile) {
    currentSelected.current =
      currentSelected.current === file ? null : file
    let cur: HdfsTreeFile | null = null
    const tempTreeFiles: HdfsTreeFile[] = Object.assign([], treeFiles)
    for (let index of file.indexPath) {
      cur = cur ? cur.files![index] : tempTreeFiles[index]
    }
    if (cur?.files !== undefined) return
    queryPath.current = cur!.path
    const curHdfsFiles = (await runLoadFiles(
      queryClient.fetchQuery({
        ...getPathQueryConfig(cur!.path),
        retry: 0,
      })
    )) as HdfsFile[]
    queryPath.current = ''
    if (cur) {
      cur.files = parseHdfsFiles2TreeFiles(
        sortFiles(curHdfsFiles),
        cur.indexPath
      )
      setTreeFiles(tempTreeFiles)
    } else {
      throw new Error('cur is null')
    }
  }

  function handleMoveFile() {
    if (!currentSelected.current) {
      setToast({
        type: 'error',
        text: '请选择目标文件夹',
      })
      return
    }
    runMoveFile(
      moveFile(
        user!.username,
        targetFile.path,
        currentSelected.current.path
      )
    )
      .then(() => {
        queryClient.invalidateQueries()
        close()
        setToast({
          type: 'success',
          text: '移动成功',
        })
      })
      .catch(() => {
        setToast({
          type: 'error',
          text: '移动失败',
        })
      })
  }

  function makeChildren(value: Array<HdfsTreeFile> = []) {
    if (!value || !value.length) return null
    return value
      .sort((a, b) => {
        if (a.type !== b.type) return a.type !== 'directory' ? 1 : -1
        return `${a.name}`.charCodeAt(0) - `${b.name}`.charCodeAt(0)
      })
      .map((item, index) => {
        if (item.type === 'directory')
          return (
            <TreeFolder
              name={item.name}
              isLoading={
                isLoadingFiles && queryPath.current === item.path
              }
              onClick={() => handleDirectoryClick(item)}
              key={`folder-${item.name}-${index}`}
              hasChildren={
                item.files === undefined ||
                item.files.length > 0 ||
                item.path === '/'
              }
              selected={currentSelected.current === item}>
              {makeChildren(item.files)}
            </TreeFolder>
          )
        return (
          <TreeFile
            name={item.name}
            key={`file-${item.name}-${index}`}
          />
        )
      })
  }

  return (
    <div>
      <Drawer
        className=" !w-80"
        visible={visible}
        onClose={() => setVisible(false)}
        placement="right">
        <Drawer.Content>
          <div className="space-x-2">
            <Button
              onClick={() => handleMoveFile()}
              loading={isMovingFile}
              scale={2 / 3}
              auto
              type="secondary">
              移动
            </Button>
          </div>
          <Tree className="mt-4">{makeChildren(treeFiles)}</Tree>
        </Drawer.Content>
      </Drawer>
    </div>
  )
}

export default MoveModal
