import { Spinner } from '@geist-ui/react'
import {
  Folder,
  MinusSquare,
  Plus,
  PlusSquare,
} from '@geist-ui/react-icons'
import React from 'react'
import { setChildrenProps } from '../../utils/helper'
import Expand from '../../utils/lib/expand'
import TreeFile from './TreeFile'

type TreeFolderProps = React.PropsWithChildren<{
  onClick?: (...args: any) => void
  name: string
  isLoading?: boolean
  level?: number
  hasChildren?: boolean
  selected?: boolean
}>

const defaultProps = {
  level: 0,
}

function ExpandIcon({ isExpanded }: { isExpanded: boolean }) {
  if (!isExpanded) return <PlusSquare size={14} />
  return <MinusSquare size={14} />
}

function TreeFolder(props: TreeFolderProps & typeof defaultProps) {
  const [expanded, setExpanded] = React.useState(false)

  const nextChildren = setChildrenProps(
    props.children,
    {
      level: props.level + 1,
    },
    [TreeFolder, TreeFile]
  )

  return (
    <div id="folder" className=" text-sm">
      <div
        id="name"
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(!expanded)
          props.onClick!()
        }}
        className={`flex items-center relative h-6 cursor-pointer 
        ${props.selected ? 'text-blue-500' : ''}`}
        style={{
          marginLeft: `calc(1.875rem * ${props.level})`,
        }}>
        <span
          id="status"
          className="absolute left-[calc(-1.125rem)] 
        top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 z-10 ">
          {props.isLoading ? (
            <Spinner className="!w-3 !h-3 relative top-[1px]" />
          ) : Object.keys(props).includes('hasChildren') ? (
            props.hasChildren ? (
              <ExpandIcon isExpanded={expanded} />
            ) : null
          ) : (
            <ExpandIcon isExpanded={expanded} />
          )}
        </span>
        <Folder size={18} className="mr-2 z-10" />
        <span className="z-10"> {props.name}</span>
      </div>
      <Expand isExpanded={expanded} delay={200}>
        <div id="content">{nextChildren}</div>
      </Expand>
    </div>
  )
}

TreeFolder.defaultProps = defaultProps
export default TreeFolder
