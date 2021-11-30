import { Button, Tooltip } from '@geist-ui/react'
import { UploadCloud } from '@geist-ui/react-icons'
import Upload from 'rc-upload'
import { useHash } from 'react-use'
import { useAuth } from '../context/auth-context'
import { client } from '../utils/api-client'

export default function UploadFile() {
  const { user } = useAuth()
  const [hash] = useHash()
  return (
    <Upload
      action={`/api/path?path=${
        user!.username +
        '/' +
        hash.substring(
          hash.indexOf('/') === hash.lastIndexOf('/') ? 2 : 1,
          hash.lastIndexOf('/')
        )
      }`}>
      <Tooltip text="上传文件">
        <Button icon={<UploadCloud />} auto />
      </Tooltip>
    </Upload>
  )
}
