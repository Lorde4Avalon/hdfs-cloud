import { Input, Modal, useModal, useToasts } from '@geist-ui/react'
import React from 'react'
import { useAuth } from '../context/auth-context'
import { client, queryClient } from '../utils/api-client'
import { useAsync, useInputFocus, usePath } from '../utils/hooks'

type RenameFile = (params: {
  username: string
  path: string
  oldName: string
  newName: string
}) => Promise<any>

const renameFile: RenameFile = ({
  username,
  path,
  oldName,
  newName,
}) => {
  return client('path', {
    customConfig: {
      method: 'PUT',
    },
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      username,
      src: path + '/' + oldName,
      dst: path + '/' + newName,
    },
  })
}

function RenameModal({
  visible,
  setVisible,
  bindings,
  fileName,
}: OperationModalProps) {
  const [text, setText] = React.useState('')
  const { run, isLoading } = useAsync()
  const [toasts, setToast] = useToasts()
  const { user } = useAuth()
  const [path] = usePath()

  function handleOnClick() {
    if (text.trim().length === 0) {
      setToast({
        text: '请输入一个有效的文件名',
        type: 'error',
      })
      return
    }
    run(
      renameFile({
        username: user!.username,
        path,
        oldName: fileName,
        newName: text,
      })
    )
      .then(() => {
        queryClient.invalidateQueries()
        setVisible(false)
        setToast({
          text: `将“${fileName}”重命名为“${text}”`,
          type: 'success',
        })
      })
      .catch(() => {
        setToast({
          text: `重命名“${fileName}”失败`,
          type: 'error',
        })
      })
  }

  function handleKeyDown(
    e: Parameters<React.KeyboardEventHandler>[0]
  ) {
    if (e.key === 'Enter') {
      handleOnClick()
    }
  }

  return (
    <Modal {...bindings}>
      <Modal.Title>重命名</Modal.Title>
      <Modal.Subtitle>输入新名称</Modal.Subtitle>
      <Modal.Content>
        <Input
          ref={useInputFocus()}
          width="100%"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Modal.Content>
      <Modal.Action passive onClick={() => setVisible(false)}>
        取消[ESC]
      </Modal.Action>
      <Modal.Action onClick={handleOnClick}>确定[Enter]</Modal.Action>
    </Modal>
  )
}

export default RenameModal
