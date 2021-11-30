import { Button, Card, Input, Modal, useModal } from '@geist-ui/react'
import { Key, User } from '@geist-ui/react-icons'
import logo from './logo.svg'
import { useAuth } from './context/auth-context'
import { useAsync } from './utils/hooks'

function LoginForm({
  visible,
  setVisible,
  bindings,
  onSubmit,
}: Omit<ReturnType<typeof useModal>, 'currentRef'> & {
  onSubmit: Function | null
}) {
  const { isLoading, isError, error, run } = useAsync()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { username, password } = (e.target as any).elements
    run(
      onSubmit!({
        username: username.value,
        password: password.value,
      })
    )
  }

  return (
    <Modal {...bindings}>
      <Modal.Title>登&nbsp;录</Modal.Title>
      <Modal.Content className="!px-12">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            name="username"
            width="100%"
            icon={<User />}
            placeholder="用户名"
          />
          <Input.Password
            name="password"
            width="100%"
            className="!w-full"
            icon={<Key />}
            placeholder="密码"
          />
          <div className="grid grid-cols-2 gap-4">
            <Button
              loading={isLoading}
              htmlType="submit"
              className="!min-w-full"
              type="secondary">
              登&nbsp;录
            </Button>
            <Button
              onClick={() => setVisible(false)}
              className="!min-w-full">
              取&nbsp;消
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  )
}

function RegisterForm({
  visible,
  setVisible,
  bindings,
  onSubmit,
}: Omit<ReturnType<typeof useModal>, 'currentRef'> & {
  onSubmit: Function | null
}) {
  const { isLoading, isError, error, run } = useAsync()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { username, password } = (e.target as any).elements
    run(
      onSubmit!({
        username: username.value,
        password: password.value,
      })
    )
  }
  return (
    <Modal {...bindings}>
      <Modal.Title>注&nbsp;册</Modal.Title>
      <Modal.Content className="!px-12 !space-y-2">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            name="username"
            width="100%"
            icon={<User />}
            placeholder="用户名"
          />
          <Input.Password
            name="password"
            width="100%"
            className="!w-full"
            icon={<Key />}
            placeholder="密码"
          />
          <Input.Password
            width="100%"
            className="!w-full"
            icon={<Key />}
            placeholder="确认密码"
          />
          <div className="grid grid-cols-2 gap-4">
            <Button
              loading={isLoading}
              htmlType="submit"
              className="!min-w-full"
              type="secondary">
              注&nbsp;册
            </Button>
            <Button
              onClick={() => setVisible(false)}
              className="!min-w-full">
              取&nbsp;消
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  )
}

export default function UnauthenticatedApp() {
  const { login, register } = useAuth()

  const {
    visible: loginVisible,
    setVisible: setLoginVisible,
    bindings: loginBindings,
  } = useModal()

  const {
    visible: registerVisible,
    setVisible: setRegisterVisible,
    bindings: registerBindings,
  } = useModal()
  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className=" w-64">
          <div className="text-center flex flex-col items-center space-y-6">
            <img className="!w-24" src={logo} alt="logo" />
            <h1 className="text-3xl font-bold">HDFS Cloud</h1>
          </div>
          <div className="flex justify-center space-x-4 mt-12">
            <Button
              onClick={() => setLoginVisible(true)}
              className="!min-w-[50%]"
              type="secondary"
              ghost>
              登&nbsp;录
            </Button>
            <Button
              onClick={() => setRegisterVisible(true)}
              className="!min-w-[50%]"
              type="secondary">
              注&nbsp;册
            </Button>
          </div>
        </div>
      </div>
      <LoginForm
        onSubmit={login}
        visible={loginVisible}
        setVisible={setLoginVisible}
        bindings={loginBindings}
      />
      <RegisterForm
        onSubmit={register}
        visible={registerVisible}
        setVisible={setRegisterVisible}
        bindings={registerBindings}
      />
    </>
  )
}
