import {
  Button,
  Input,
  Loading,
  Modal,
  Tag,
  Tooltip,
  useModal,
} from '@geist-ui/react'
import { File, Search } from '@geist-ui/react-icons'
import React, { useState } from 'react'
import { useInputFocus, usePath } from '../utils/hooks'
import {
  downloadFile,
  useFileSearch,
} from '../utils/path'
import FileOperationsPopover from './FileOperationsPopover'

function SearchButton() {
  const { setVisible, bindings } = useModal()
  const [key, setKey] = useState('')
  const [queried, setQueried] = useState(false)
  const [path, setPath] = usePath()
  const { files, isLoading, isError } = useFileSearch(path, key)
  const { autoFocusRef, focusOnInput, clearInput } = useInputFocus()

  bindings.onClose = () => {
    setVisible(false)
    setTimeout(() => {
      setKey('')
    }, 300)
  }

  const handleKeyDown = (
    e: Parameters<React.KeyboardEventHandler>[0]
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setKey((e.target as HTMLInputElement).value)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { key } = e.currentTarget.elements as any
    setKey(key.value)
  }

  const handleClearClick = () => {
    setKey('')
    focusOnInput()
    clearInput()
  }

  const operations: Operation[] = [
    {
      title: '转到目标文件夹',
      onClick: async (file: HdfsFile) => {
        if (file.path) {
          setPath(file.path.substring(0, file.path.lastIndexOf('/')))
          setVisible(false)
        } else {
          throw new Error('file path is empty')
        }
      },
    },
    {
      title: '下载',
      onClick: (file: HdfsFile) => {
        if (file.path) {
          downloadFile(file.path)
        } else {
          throw new Error('file path is empty')
        }
      },
    },
  ]

  return (
    <>
      <Tooltip text="搜索此目录下的文件">
        <Button
          onClick={() => setVisible(true)}
          icon={<Search />}
          auto
        />
      </Tooltip>
      <Modal {...bindings}>
        <Modal.Title>搜索文件</Modal.Title>
        <Modal.Subtitle>搜索此目录下包括子目录的文件</Modal.Subtitle>
        <Modal.Content>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              name="key"
              icon={<Search />}
              className="!text-sm"
              placeholder="键入关键词"
              ref={autoFocusRef}
              width="100%"
              onKeyDown={handleKeyDown}
            />
            <Button
              htmlType="submit"
              loading={isLoading}
              className="!h-full"
              scale={2 / 3}>
              搜索
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-sm text-center">
            {files ? (
              files.length > 0 ? (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.path}
                      className="px-4 py-2 border border-[color:#eaeaea] 
                      rounded-md flex justify-between">
                      <div className="flex items-center text-sm">
                        <File size={14} />
                        <span className="ml-2">{file.name}</span>
                      </div>
                      <FileOperationsPopover
                        operations={operations}
                        file={file}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-[color:#444444]">
                    找不到包含关键字“{key}”的文件
                  </span>
                  <Button
                    onClick={handleClearClick}
                    className="!w-12 !mt-2"
                    scale={2 / 3}>
                    清除
                  </Button>
                </div>
              )
            ) : null}
            {isLoading ? <Loading /> : null}
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default SearchButton
