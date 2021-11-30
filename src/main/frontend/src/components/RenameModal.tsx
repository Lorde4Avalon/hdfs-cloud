import { Input, Modal, useModal } from '@geist-ui/react'
import React from 'react'

type Props = Omit<ReturnType<typeof useModal>, 'currentRef'>

function handleKeyDown(e: Parameters<React.KeyboardEventHandler>[0]) {
  if (e.key === 'Enter') {
  }
}

function RenameModal({ visible, setVisible, bindings }: Props) {
  const [text, setText] = React.useState('')

  return (
    <Modal {...bindings}>
      <Modal.Title>重命名</Modal.Title>
      <Modal.Subtitle>输入新名称</Modal.Subtitle>
      <Modal.Content>
        <Input
          autoFocus
          width="100%"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Modal.Content>
    </Modal>
  )
}

export default RenameModal
