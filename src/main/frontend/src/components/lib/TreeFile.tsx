import { File } from '@geist-ui/react-icons'

type TreeFileProps = {
  onClick?: (...args: any) => void
  name: string
  level?: number
}

const defaultProps: Partial<TreeFileProps> = {
  level: 0,
}

function TreeFile(props: TreeFileProps) {
  return (
    <div id="file" className=" text-sm">
      <div
        id="name"
        onClick={props.onClick}
        className="flex items-center relative h-6"
        style={{
          marginLeft: `calc(1.875rem * ${props.level})`,
        }}>
        <span
          id="status"
          className="absolute left-[calc(-1.125rem)] 
        top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 z-10 "></span>
        <File size={18} className="mr-2" />
        {props.name}
      </div>
    </div>
  )
}

TreeFile.defaultProps = defaultProps
export default TreeFile
