import { PropsWithChildren } from 'react'
import React from 'react'
import { GeistProvider } from '@geist-ui/react'
import { QueryClientProvider } from 'react-query'
import { AuthProvider } from './auth-context'
import { queryClient } from '../utils/api-client'


function AppProviders(props: PropsWithChildren<unknown>) {
  return (
    <React.StrictMode>
      <GeistProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{props.children}</AuthProvider>
        </QueryClientProvider>
      </GeistProvider>
    </React.StrictMode>
  )
}

export { AppProviders }
