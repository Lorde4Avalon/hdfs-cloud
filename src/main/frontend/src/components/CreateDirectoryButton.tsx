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
import { useAuth } from '../context/auth-context'
import { client, queryClient } from '../utils/api-client'
import { useAsync, useInputFocus, usePath } from '../utils/hooks'

function CreateDirectoryButton() {
  const { user } = useAuth()
  const { setVisible, bindings } = useModal()
  const [text, setText] = React.useState('')
  const { run, isLoading } = useAsync()
  const [path] = usePath()
  const [, setToast] = useToasts()
  const { autoFocusRef } = useInputFocus()

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
      )
        .then(() => {
          queryClient.invalidateQueries()
          setToast({
            text: `文件夹 ${text} 创建成功`,
            type: 'success',
          })
          setVisible(false)
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      setToast({
        text: '请输入一个有效的文件夹名称',
        type: 'error',
      })
    }
  }

  function handleKeyDown(
    e: Parameters<React.KeyboardEventHandler>[0]
  ) {
    if (e.key === 'Enter') {
      handleCreateDirectory()
    }
  }

  return (
    <>
      <Tooltip text="在此目录创建新文件夹">
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
            ref={autoFocusRef}
            width="100%"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          取消[ESC]
        </Modal.Action>
        <Modal.Action
          loading={isLoading}
          onClick={handleCreateDirectory}>
          确定[Enter]
        </Modal.Action>
      </Modal>
    </>
  )
}

export default CreateDirectoryButton
