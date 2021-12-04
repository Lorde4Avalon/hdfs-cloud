import React from 'react'
import { useHash } from 'react-use'

export function useInputFocus() {
  const isFocus = React.useRef(false)
  const element = React.useRef<HTMLElement | null>(null)
  if (isFocus.current) isFocus.current = false
  const focusOnInput = () => {
    if (element.current) {
      element.current.focus()
    }
  }

  const clearInput = () => {
    if (element.current instanceof HTMLInputElement) {
      element.current.value = ''
    } else {
      throw new Error('Element is not an input')
    }
  }

  const autoFocusRef = React.useCallback(
    (inputElement: HTMLElement | null) => {
      if (!isFocus.current && inputElement) {
        element.current = inputElement
        setTimeout(() => {
          inputElement.focus()
          isFocus.current = true
        }, 100)
      }
    },
    []
  )

  return {
    focusOnInput,
    autoFocusRef,
    clearInput,
  }
}

export function usePath() {
  const [hash, setHash] = useHash()
  const path = hash ? hash.substring(1) : '/'
  function setPath(newPath: string) {
    setHash(newPath)
  }
  return [path, setPath] as const
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
