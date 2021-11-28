import { Button } from '@geist-ui/react'
import Upload from 'rc-upload'
import { client } from '../utils/api-client'

const props: Upload['props'] = {
  action: '/api/path',

}

export default function UploadFile() {
  return (
    <Upload {...props}>
      <Button>上传文件</Button>
    </Upload>
  )
}
