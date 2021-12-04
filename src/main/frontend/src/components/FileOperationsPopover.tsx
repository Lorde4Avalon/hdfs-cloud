import { Popover } from '@geist-ui/react'
import { MoreVertical } from '@geist-ui/react-icons'
import React from 'react'

export interface FileOperationsPopoverProps {
  operations: Operation[]
  file: HdfsFile
}

function FileOperationsPopover({
  operations,
  file,
}: FileOperationsPopoverProps) {
  const [visible, setVisible] = React.useState(false)

  const handleClick = (e: React.MouseEvent<any, MouseEvent>) => {
    e.stopPropagation()
    setVisible(true)
  }

  const popoverContent = () => (
    <ul>
      {operations.map(({ title, className, onClick }) => (
        <li
          onClick={() => onClick(file)}
          key={title}
          className="text-[color:#444444] text-sm 
          cursor-pointer select-none relative py-2 pl-3 
          pr-9 hover:bg-[#fafafa]">
          <div className="flex items-center">
            <span
              className={`block truncate ${
                className ? className : ''
              }`}>
              {title}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <Popover
      visible={visible}
      onClick={handleClick}
      onVisibleChange={(visible) =>
        visible ? null : setVisible(false)
      }
      className="popover relative hover:before:opacity-100 
      before:opacity-0 before:absolute before:w-6 before:h-6 
      before:top-1/2 before:left-1/2 before:-translate-y-1/2 
      before:-translate-x-1/2 before:bg-gray-100 before:rounded-full 
      -z-[10]"
      content={popoverContent}>
      <MoreVertical size={16} className="cursor-pointer" />
    </Popover>
  )
}

export default FileOperationsPopover
