import React from 'react'
import { useHash } from 'react-use'

export function usePath() {
  const [hash] = useHash()
  const path = hash ? hash.substring(1) : '/'
  return [path]
}

export function useSafeDispatch(dispatch: Function) {
  const mounted = React.useRef(false)
  // useLayoutEffect to make sure the effect is only run once
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  // useCallback to avoid re-render
  return React.useCallback(
    (...args) => (mounted.current ? dispatch(...args) : null),
    [dispatch]
  )
}

export type AsyncState = {
  status: 'idle' | 'pending' | 'rejected' | 'resolved'
  data: any
  error: any
}

const defaultInitialState: AsyncState = {
  status: 'idle',
  data: null,
  error: null,
}

export function useAsync<R>(initialState?: AsyncState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })

  // useReducer to merge state and action
  const [{ status, data, error }, setState] = React.useReducer(
    (state: any, action: any) => ({ ...state, ...action }),
    initialStateRef.current
  )

  const safeSetState = useSafeDispatch(setState)

  const setData = React.useCallback(
    (data: any) => safeSetState({ status: 'resolved', data }),
    [safeSetState]
  )
  const setError = React.useCallback(
    (error: any) => safeSetState({ status: 'rejected', error }),
    [safeSetState]
  )
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState]
  )

  const run = React.useCallback(
    <T>(promise: Promise<T>) => {
      if (!promise || !promise.then) {
        throw new Error('useAsync: first argument must be a promise')
      }
      safeSetState({ status: 'pending' })
      return promise.then(
        (data) => {
          setData(data)
          return data
        },
        (error) => {
          setError(error)
          return Promise.reject(error)
        }
      )
    },
    [safeSetState, setData, setError]
  )

  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    status,
    setData,
    setError,
    error,
    data,
    run,
    reset,
  }
}
