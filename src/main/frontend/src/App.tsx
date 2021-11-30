import * as React from 'react'
import FullScreenSpin from './components/FullScreenSpin'
import { useAuth } from './context/auth-context'

const AuthenticatedApp = React.lazy(
  () => import(/* webpackPrefetch: true */ './AuthenticatedApp')
)
const UnauthenticatedApp = React.lazy(
  () => import('./UnauthenticatedApp')
)

function App() {
  const { user } = useAuth()
  return (
    <React.Suspense fallback={<FullScreenSpin />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export default App
