import React from 'react'
import { useAsync } from '../utils/hooks'
import * as auth from '../auth-provider'
import { client, queryClient } from '../utils/api-client'
import FullScreenSpin from '../components/FullScreenSpin'
import { useCookie } from 'react-use'
import { useToasts } from '@geist-ui/react'
import { AlertCircle, Frown } from '@geist-ui/react-icons'

async function getUser(token: string | null) {
  let user = null
  if (token) {
    user = await queryClient.fetchQuery({
      queryKey: 'user',
      queryFn: () => client('user'),
    })
  }
  return user
}

const AuthContext = React.createContext<{
  user: User | null
  login: ((form: any) => Promise<User>) | null
  register: ((form: any) => Promise<User>) | null
  logout: (() => Promise<User>) | null
}>({
  user: null,
  login: null,
  register: null,
  logout: null,
})

function AuthProvider(props: any) {
  const {
    status,
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  const [token, updateCookie, deleteCookie] =
    useCookie('authorization')

  const [toasts, setToast] = useToasts()

  React.useEffect(() => {
    run(getUser(token))
  }, [run])

  const login = React.useCallback(
    (form) =>
      auth
        .login(form)
        .then((user) => {
          setData(user)
          setToast({
            text: '登录成功！',
            type: 'success',
          })
        })
        .catch((error) => {
          setToast({
            text: error.text,
            type: 'error',
          })
        }),
    [setData]
  )

  const register = React.useCallback(
    (form) =>
      auth
        .register(form)
        .then((user) => {
          setData(user)
          setToast({
            text: '注册成功！',
            type: 'success',
          })
        })
        .catch((error) => {
          setToast({
            text: error.text,
            type: 'error',
          })
        }),
    [setData]
  )

  const logout = React.useCallback(() => {
    auth.logout()
    deleteCookie()
    setData(null)
    setToast({
      text: '您已退出登录！',
    })
  }, [setData])

  const value = React.useMemo(
    () => ({ user, login, logout, register }),
    [login, logout, register, user]
  )

  if (isLoading || isIdle) {
    return <FullScreenSpin />
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />
  }

  if (isError) {
    return (
      <div className="h-screen w-screen grid place-items-center">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle size={48} />
          <h2 className="text-xl">出错了</h2>
          <p>请稍后再试</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function useClient() {
  const { user } = useAuth()
  const token = user?.token
  return React.useCallback(
    (endpoint, config) => client(endpoint, { ...config, token }),
    [token]
  )
}

export { AuthProvider, useAuth, useClient }
