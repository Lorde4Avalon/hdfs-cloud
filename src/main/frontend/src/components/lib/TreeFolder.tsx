import { Spinner } from '@geist-ui/react'
import { Folder, Plus, PlusSquare } from '@geist-ui/react-icons'
import React from 'react'
import { setChildrenProps } from '../../utils/helper'
import TreeFile from './TreeFile'

type TreeFolderProps = React.PropsWithChildren<{
  onClick?: (...args: any) => void
  name: string
  isLoading?: boolean
  level?: number
}>

const defaultProps = {
  level: 0,
}

function TreeFolder(props: TreeFolderProps & typeof defaultProps) {
  const nextChildren = setChildrenProps(
    props.children,
    {
      level: props.level + 1,
    },
    [TreeFolder, TreeFile]
  )

  return (
    <div id="folder" data-level={props.level} className=" text-sm">
      <div
        id="name"
        onClick={props.onClick}
        className="flex items-center relative"
        style={{
          marginLeft: `calc(1.875rem * ${props.level})`,
        }}>
        <span
          id="status"
          className="absolute left-[calc(-1.125rem)] 
        top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 z-10 ">
          {props.isLoading ? (
            <Spinner className="!w-3 !h-3 relative top-[1px]" />
          ) : (
            <PlusSquare size={14} />
          )}
        </span>
        <Folder size={18} className="mr-2" />
        {props.name}
      </div>
      <div id="content">{nextChildren}</div>
    </div>
  )
}

TreeFolder.defaultProps = defaultProps
export default TreeFolder
