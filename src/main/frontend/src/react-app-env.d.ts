/// <reference types="react-scripts" />

interface HdfsFile {
  name: string
  len: number
  modTime: number
  type: 'dir' | 'file'
  operation: 'more' | 'back'
}

interface User {
  id: number
  username: string
  token: string
}
