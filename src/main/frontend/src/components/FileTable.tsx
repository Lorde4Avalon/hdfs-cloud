import {
  Button,
  Link,
  Popover,
  Spacer,
  Table,
  useModal,
} from '@geist-ui/react'
import { File, Folder, MoreVertical } from '@geist-ui/react-icons'
import {
  TableColumnRender,
  TableOnRowClick,
} from '@geist-ui/react/dist/table/table-types'
import React from 'react'
import { useHash } from 'react-use'
import { formatTimestamp } from '../utils/misc'

interface Props {
  data: HdfsFile[]
  updatePath: (path: string) => void
}

const renderTime: TableColumnRender<HdfsFile> = (value, rowData) => {
  if (rowData.operation === 'back') return
  return <span>{formatTimestamp(rowData.modTime)}</span>
}

const renderName: TableColumnRender<HdfsFile> = (value, rowData) => {
  const type = rowData.type
  // const icon = <span className={`iconfont icon-${type} mr-2`} />
  const ICON_SIZE = 16
  const icon =
    type === 'dir' ? (
      <Folder size={ICON_SIZE} />
    ) : type === 'file' ? (
      <File size={ICON_SIZE} />
    ) : (
      ''
    )
  return (
    <span className="flex items-center">
      <span className="mr-2">{icon}</span> {value}
    </span>
  )
}

const renderSize: TableColumnRender<HdfsFile> = (value, rowData) => {
  console.log(value)
  if (rowData.operation === 'back') return
  if (!value) return <span>-</span>
  if (rowData.type === 'dir') return <span>-</span>
  return <span>{value}</span>
}

const renderOperation: TableColumnRender<HdfsFile> = (
  value,
  rowData
) => {
  if (rowData.operation === 'back') return <span></span>

  const operations = [
    {
      title: '重命名',
      className: undefined,
      fn: () => {},
    },
    {
      title: '删除',
      className: 'text-red-600',
      fn: () => {},
    },
  ]

  const content = () => (
    <ul>
      {operations.map(({ title, className, fn }) => (
        <li
          onClick={fn}
          key={title}
          className="text-[color:#444444] text-sm cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-[#fafafa]">
          <div className="flex items-center">
            <span
              className={`block truncate ${
                className ? className : ''
              }`}>
              {title}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <Popover className="popover" content={content}>
      <MoreVertical className="cursor-pointer" />
      <style scoped>{`
      .popover .tooltip-content .inner {
          padding: 0.25rem 0 !important;
        }
      `}</style>
    </Popover>
  )
}

const FilesTable = ({ data, updatePath }: Props) => {
  const [hash, setHash] = useHash()
  const isHome = !hash || hash.substring(1) === '/'
  const {
    visible: renameModalVisible,
    setVisible: setRenameModalVisbile,
    bindings: renameModalBindings,
  } = useModal()

  if (!data) data = []
  if (!isHome) {
    data = [
      {
        name: '...',
        len: 0,
        modTime: 0,
        type: 'dir',
        operation: 'back',
      },
      ...data,
    ]
  }
  const handleOnRowClick: TableOnRowClick<HdfsFile> = (
    rowData,
    index
  ) => {
    if (rowData.operation === 'back') {
      updatePath(
        hash.substring(
          hash.indexOf('/') === hash.lastIndexOf('/') ? 2 : 1,
          hash.lastIndexOf('/')
        )
      )
    }
    if (rowData.type === 'dir' && rowData.operation !== 'back') {
      updatePath((hash ? hash.substring(1) : '') + '/' + rowData.name)
    }
  }

  return (
    <>
      <Table
        data={data}
        rowClassName={() => 'cursor-pointer'}
        onRow={handleOnRowClick}>
        <Table.Column
          prop="name"
          label="文件名"
          render={renderName}
        />
        <Table.Column
          prop="modTime"
          label="最后修改时间"
          render={renderTime}
        />
        <Table.Column prop="len" label="大小" render={renderSize} />
        <Table.Column prop="operation" render={renderOperation} />
      </Table>
    </>
  )
}

export default FilesTable
