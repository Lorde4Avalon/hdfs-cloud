import { useCookie } from 'react-use'
import { client, queryCache, queryClient } from './utils/api-client'

const localStorageKey = '__auth_provider_token__'

async function useToken() {
  const [token] = useCookie('authorization')
  return token
}

function handleUserResponse(user: User) {
  window.localStorage.setItem(localStorageKey, user.token)
  return user
}

function login({
  username,
  password,
}: {
  username: string
  password: string
}) {
  return client('login', {
    data: { username, password },
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleUserResponse)
}

function register({
  username,
  password,
}: {
  username: string
  password: string
}) {
  return client('register', {
    data: { username, password },
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleUserResponse)
}

async function logout() {
  queryCache.clear()
  queryClient.clear()
  window.location.assign('/#/')
  window.localStorage.removeItem(localStorageKey)
}

// an auth provider wouldn't use your client, they'd have their own
// so that's why we're not just re-using the client
const authURL = process.env.REACT_APP_AUTH_URL

// async function client(endpoint: string, data: object) {
//   const config = {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: { 'Content-Type': 'application/json' },
//   }

//   return window.fetch(`${authURL}/${endpoint}`, config).then(async response => {
//     const data = await response.json()
//     if (response.ok) {
//       return data
//     } else {
//       return Promise.reject(data)
//     }
//   })
// }

export { useToken, login, register, logout, localStorageKey }
