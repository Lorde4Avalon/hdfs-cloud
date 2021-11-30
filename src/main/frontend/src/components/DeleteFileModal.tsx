import { Modal, useModal } from '@geist-ui/react'

type Props = Omit<ReturnType<typeof useModal>, 'currentRef'>

function DeleteFileModal({ visible, setVisible, bindings }: Props) {
  return (
    <Modal {...bindings}>
      <Modal.Title>确定要删除这个文件吗？</Modal.Title>
      <Modal.Action passive onClick={() => setVisible(false)}>
        取消[ESC]
      </Modal.Action>
      <Modal.Action>确定[Enter]</Modal.Action>
    </Modal>
  )
}

export default DeleteFileModal
