import { Button, Popover, Progress, Tooltip } from '@geist-ui/react'
import { UploadCloud } from '@geist-ui/react-icons'
import Upload from 'rc-upload'
import React, { useRef } from 'react'
import { useState } from 'react'
import { useHash } from 'react-use'
import { useAuth } from '../context/auth-context'
import { client, queryClient } from '../utils/api-client'
import { useAsync, usePath } from '../utils/hooks'

export default function UploadFile() {
  const { user } = useAuth()
  const [path] = usePath()
  const [percent, setPercent] = useState(0)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const uploadElement = useRef<HTMLDivElement | null>(null)
  const { run, isLoading: isFetching } = useAsync()

  const isUploading = React.useMemo(
    () => (percent > 0 && percent < 100) || isFetching,
    [percent]
  )

  const popoverContent = () => (
    <div className="px-4">
      文件上传中...
      <Progress className="!mt-1 !w-36" value={percent} />
    </div>
  )

  function handleUpload(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (uploadElement.current) {
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: e.clientX,
        clientY: e.clientY,
      })
      uploadElement.current.dispatchEvent(event)
    }
  }

  return (
    <Upload
      action={`/api/path`}
      data={{
        dst: path,
        username: user!.username,
      }}
      onSuccess={() => {
        run(queryClient.invalidateQueries())
      }}
      onProgress={(progress) => {
        setPercent(progress.percent)
      }}>
      <div ref={uploadElement} className="inline-block">
        <Tooltip text="上传文件">
          <Popover
            onClick={(e) => e.stopPropagation()}
            content={popoverContent}
            visible={isUploading}>
            <Button
              onClick={(e) => handleUpload(e)}
              icon={<UploadCloud />}
              auto
            />
          </Popover>
        </Tooltip>
      </div>
    </Upload>
  )
}
