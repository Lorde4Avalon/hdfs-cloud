import React from 'react'
import { Spinner } from '@geist-ui/react'

export default function FullScreenSpin() {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <Spinner className="!w-12" />
    </div>
  )
}
