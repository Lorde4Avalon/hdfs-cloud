import {
  Button,
  Input,
  Modal,
  Tooltip,
  useModal,
  useToasts,
} from '@geist-ui/react'
import { FolderPlus } from '@geist-ui/react-icons'
import React from 'react'
import { useHash } from 'react-use'
import { useAuth } from '../context/auth-context'
import { client, queryClient } from '../utils/api-client'
import { useAsync, usePath } from '../utils/hooks'

function CreateDirectory() {
  const { user } = useAuth()
  const { visible, setVisible, bindings } = useModal()
  const [text, setText] = React.useState('')
  const { run, isLoading, isError, error } = useAsync()
  const [path] = usePath()
  const [toasts, setToast] = useToasts()

  function handleCreateDirectory() {
    if (text.trim().length !== 0) {
      run(
        client('/path', {
          headers: {
            'Content-Type': 'application/json',
          },
          customConfig: {
            method: 'PUT',
          },
          data: {
            username: user!.username,
            dst: path + '/' + text,
          },
        })
      ).then(() => {
        queryClient.invalidateQueries()
        setToast({
          text: `文件夹 ${text} 创建成功`,
          type: 'success',
        })
        setVisible(false)
      })
    } else {
      setToast({
        text: '请输入一个有效的文件夹名称',
        type: 'error',
      })
    }
  }

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        handleCreateDirectory()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <Tooltip text="创建新文件夹">
        <Button
          onClick={() => setVisible(true)}
          icon={<FolderPlus />}
          auto
        />
      </Tooltip>
      <Modal {...bindings}>
        <Modal.Title>创建文件夹</Modal.Title>
        <Modal.Subtitle>请输入文件夹名称</Modal.Subtitle>
        <Modal.Content>
          <Input
            autoFocus
            width="100%"
            onChange={(e) => setText(e.target.value)}
          />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          取消[ESC]
        </Modal.Action>
        <Modal.Action onClick={handleCreateDirectory}>
          确定[Enter]
        </Modal.Action>
      </Modal>
    </>
  )
}

export default CreateDirectory
