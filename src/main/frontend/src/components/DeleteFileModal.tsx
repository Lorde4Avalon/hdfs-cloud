import { Modal, useModal, useToasts } from '@geist-ui/react'
import { useAuth } from '../context/auth-context'
import { client, queryClient } from '../utils/api-client'
import { useAsync, usePath } from '../utils/hooks'

async function deleteFile(username: string, dst: string) {
  return client('path', {
    customConfig: {
      method: 'DELETE',
    },
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      username,
      dst,
    },
  })
}

function DeleteFileModal({
  visible,
  setVisible,
  bindings,
  fileName,
}: OperationModalProps) {
  const { run, isLoading } = useAsync()
  const { user } = useAuth()
  const [path] = usePath()
  const [toasts, setToast] = useToasts()

  function handleOnClick() {
    run(deleteFile(user!.username, path + '/' + fileName))
      .then(() => {
        setToast({
          text: `文件“${fileName}”已删除`,
          type: 'success',
        })
        setVisible(false)
        queryClient.invalidateQueries()
      })
      .catch((e) =>
        setToast({
          text: e.message,
          type: 'error',
        })
      )
  }

  return (
    <Modal {...bindings}>
      <Modal.Title>确定要删除这个文件吗？</Modal.Title>
      <Modal.Action passive onClick={() => setVisible(false)}>
        取消[ESC]
      </Modal.Action>
      <Modal.Action loading={isLoading} onClick={handleOnClick}>
        确定[Enter]
      </Modal.Action>
    </Modal>
  )
}

export default DeleteFileModal
