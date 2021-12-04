import { Button, Drawer, Loading, Tree } from '@geist-ui/react'
import { Plus } from '@geist-ui/react-icons'
import { TreeFile } from '@geist-ui/react/dist/tree/tree'
import React from 'react'
import { queryClient } from '../utils/api-client'
import { getPathQueryConfig, usePathQuery } from '../utils/path'
import TreeFolder from './lib/TreeFolder'

function MoveModal() {
  const [state, setState] = React.useState(false)
  const { files } = usePathQuery('/')

  const [treeFiles, setTreeFiles] = React.useState<HdfsTreeFile[]>(
    () => [
      {
        type: 'directory',
        name: '我的文件',
        files: [],
        path: '/',
        indexPath: [0],
      },
    ]
  )

  type HdfsTreeFile = TreeFile & {
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
        files: type === 'directory' ? [] : undefined,
        path: file.path,
        indexPath: [...parentIndexPath, index],
      }
    })
  }

  async function handleDirectoryClick(file: HdfsTreeFile) {
    console.log('handleDirectoryClick', file)
    let cur: HdfsTreeFile | null = null
    for (let index of file.indexPath) {
      cur = cur ? cur.files![index] : treeFiles[index]
    }
    const curHdfsFiles = (await queryClient.fetchQuery(
      getPathQueryConfig(cur!.path)
    )) as HdfsFile[]
    if (cur) {
      cur.files = parseHdfsFiles2TreeFiles(
        curHdfsFiles,
        cur.indexPath
      )
      setTreeFiles(treeFiles)
    } else {
      throw new Error('cur is null')
    }
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
              onClick={() => handleDirectoryClick(item)}
              key={`folder-${item.name}-${index}`}
              name={item.name}>
              {makeChildren(item.files)}
            </TreeFolder>
          )
        return (
          <Tree.File
            name={item.name}
            extra={item.extra}
            key={`file-${item.name}-${index}`}
          />
        )
      })
  }

  return (
    <div>
      <Button auto onClick={() => setState(true)} scale={1 / 2}>
        Show Drawer
      </Button>
      <Drawer
        visible={state}
        onClose={() => setState(false)}
        placement="right">
        <Drawer.Content>
          <div className="space-x-2">
            <Button scale={2 / 3} auto type="secondary">
              移动
            </Button>
            <Button scale={2 / 3} auto icon={<Plus />}>
              新建文件夹
            </Button>
          </div>
          <Tree className="mt-4">{makeChildren(treeFiles)}</Tree>
        </Drawer.Content>
      </Drawer>
    </div>
  )
}

export default MoveModal
