/// <reference types="react-scripts" />

interface HdfsFile {
  name: string
  len: number
  modTime: number
  type: 'dir' | 'file'
  operation: 'more' | 'back'
  path: string
}

interface User {
  id: number
  username: string
  token: string
}

interface Operation {
  title: string
  className?: string
  onClick: (...args: any) => void
}

type OperationModalProps = Omit<
  ReturnType<typeof useModal>,
  'currentRef'
> & {
  fileName: HdfsFile['name']
}
