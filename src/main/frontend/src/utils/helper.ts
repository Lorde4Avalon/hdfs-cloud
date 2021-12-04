import React from 'react'
import { ReactNode } from 'react'

// https://github.dev/geist-org/react/blob/83ed1686513e1e6ed0f7fd29223cc546b5306d6c/components/utils/collections.ts#L79
export const setChildrenProps = (
  children: ReactNode | undefined,
  props: Record<string, unknown>,
  targetComponents: Array<React.ElementType> = []
): ReactNode | undefined => {
  if (React.Children.count(children) === 0) return []
  const allowAll = targetComponents.length === 0
  const clone = (child: React.ReactElement, props = {}) =>
    React.cloneElement(child, props)

  return React.Children.map(children, (item) => {
    if (!React.isValidElement(item)) return item
    if (allowAll) return clone(item, props)

    const isAllowed = targetComponents.find(
      (child) => child === item.type
    )
    if (isAllowed) return clone(item, props)
    return item
  })
}
