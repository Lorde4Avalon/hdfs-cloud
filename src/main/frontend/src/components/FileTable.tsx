import { Table, useModal } from '@geist-ui/react'
import { File, Folder } from '@geist-ui/react-icons'
import {
  TableColumnRender,
  TableOnRowClick,
} from '@geist-ui/react/dist/table/table-types'
import React from 'react'
import { useHash } from 'react-use'
import { usePath } from '../utils/hooks'
import { formatTimestamp } from '../utils/misc'
import { downloadFile } from '../utils/path'
import DeleteFileModal from './DeleteFileModal'
import FileOperationsPopover from './FileOperationsPopover'
import MoveDrawer from './MoveDrawer'
import RenameModal from './RenameModal'

interface Props {
  data: HdfsFile[]
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
  if (rowData.operation === 'back') return
  if (!value) return <span>-</span>
  if (rowData.type === 'dir') return <span>-</span>
  value = parseInt(value.toString(), 10)
  const size =
    value / 1024 > 1024
      ? (value / 1024 / 1024).toFixed(2) + 'MB'
      : (value / 1024).toFixed(2) + 'KB'
  return <span>{size}</span>
}

type RenderOperation = (
  ...params: [...Parameters<TableColumnRender<HdfsFile>>, Operation[]]
) => void | JSX.Element

const renderOperation: RenderOperation = (
  value,
  rowData,
  rowIndex,
  operations
) => {
  if (rowData.operation === 'back') return <span></span>

  return (
    <FileOperationsPopover operations={operations} file={rowData} />
  )
}

const FilesTable = ({ data }: Props) => {
  const [hash] = useHash()
  const isHome = !hash || hash.substring(1) === '/'
  const {
    visible: renameModalVisible,
    setVisible: setRenameModalVisible,
    bindings: renameModalBindings,
  } = useModal()
  const [fileName, setFileName] = React.useState('')
  const [path, setPath] = usePath()

  const {
    visible: deleteModalVisible,
    setVisible: setDeleteModalVisible,
    bindings: deleteModalBindings,
  } = useModal()

  renameModalBindings.onClose = () => (
    setFileName(''), setRenameModalVisible(false)
  )
  deleteModalBindings.onClose = () => (
    setFileName(''), setDeleteModalVisible(false)
  )

  if (!data) data = []
  if (!isHome) {
    data = [
      {
        name: '...',
        len: 0,
        modTime: 0,
        type: 'dir',
        operation: 'back',
        path: ''
      },
      ...data,
    ]
  }
  const handleOnRowClick: TableOnRowClick<HdfsFile> = (
    rowData,
    index
  ) => {
    if (rowData.operation === 'back') {
      setPath(
        hash.substring(
          hash.indexOf('/') === hash.lastIndexOf('/') ? 2 : 1,
          hash.lastIndexOf('/')
        )
      )
    }
    if (rowData.type === 'dir' && rowData.operation !== 'back') {
      setPath((hash ? hash.substring(1) : '') + '/' + rowData.name)
    }
  }

  const downloadOperation: Operation = {
    title: '下载',
    onClick: (file: HdfsFile) => {
      downloadFile(path + '/' + file.name)
    },
  }

  const renameOperation: Operation = {
    title: '重命名',
    onClick: (rowData: HdfsFile) => {
      setFileName(rowData.name)
      setRenameModalVisible(true)
    },
  }

  const deleteOperation: Operation = {
    title: '删除',
    className: 'text-red-600',
    onClick: (rowData: HdfsFile) => {
      setFileName(rowData.name)
      setDeleteModalVisible(true)
    },
  }

  const fileOperations: Operation[] = [
    downloadOperation,
    renameOperation,
    deleteOperation,
  ]
  const dirOperations: Operation[] = [
    renameOperation,
    deleteOperation,
  ]

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
        <Table.Column
          prop="operation"
          render={(value, file: HdfsFile, rowIndex) => {
            if (file.type === 'file') {
              return renderOperation(
                value,
                file,
                rowIndex,
                fileOperations
              )
            } else if (file.type === 'dir') {
              return renderOperation(
                value,
                file,
                rowIndex,
                dirOperations
              )
            } else {
              throw new Error('unknown file type')
            }
          }}
        />
      </Table>
      <RenameModal
        visible={renameModalVisible}
        setVisible={setRenameModalVisible}
        bindings={renameModalBindings}
        fileName={fileName}
      />
      <DeleteFileModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        bindings={deleteModalBindings}
        fileName={fileName}
      />
      <MoveDrawer />
    </>
  )
}

export default FilesTable
