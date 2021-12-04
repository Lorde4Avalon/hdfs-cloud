type TreeFileProps = React.PropsWithChildren<{
  onClick?: (...args: any) => void
  name: string
  level?: number
}>

const defaultProps: Partial<TreeFileProps> = {
  level: 0,
}

function TreeFile() {
  return (
    <div></div>
  )
}

TreeFile.defaultProps = defaultProps
export default TreeFile
