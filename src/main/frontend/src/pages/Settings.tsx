import { Button, Input, useToasts } from '@geist-ui/react'
import { userInfo } from 'os'
import React from 'react'
import { useAuth } from '../context/auth-context'
import { client, queryClient } from '../utils/api-client'
import { useAsync } from '../utils/hooks'

async function updateUser({ nickname }: { nickname: string }) {
  return client('user', {
    customConfig: {
      method: 'PUT',
    },
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      nickname,
    },
  })
}

const COMPONENT_SCALE = 2 / 3

function Settings() {
  const { run, isLoading } = useAsync()
  const [, setToast] = useToasts()
  const { user } = useAuth()
  const [formChanged, setFormChanged] = React.useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { nickname } = (e.target as any).elements
    if (nickname.value.trim().length > 0) {
      run(updateUser({ nickname: nickname.value }))
        .then(() => {
          queryClient.invalidateQueries('user')
          setToast({
            type: 'success',
            text: '更新成功, 刷新应用后生效',
          })
        })
        .catch(() => {
          setToast({
            type: 'error',
            text: '更新失败',
          })
        })
    } else {
      setToast({
        text: '昵称不能为空',
        type: 'error',
      })
    }
  }

  return (
    <form
      onInput={() => setFormChanged(true)}
      onSubmit={handleSubmit}
      className="pt-4 flex flex-col space-y-6">
      <div>
        <Input
          name="nickname"
          placeholder={user?.nickname ? user.nickname : ''}
          scale={COMPONENT_SCALE}>
          <span>昵称</span>
        </Input>
      </div>
      <div>
        {' '}
        <Button
          htmlType="submit"
          loading={isLoading}
          scale={COMPONENT_SCALE}
          type="secondary"
          disabled={!formChanged}
          auto>
          保存
        </Button>
      </div>
    </form>
  )
}

export default Settings
