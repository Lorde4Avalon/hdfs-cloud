import { Package } from '@geist-ui/react-icons'

function EmptyState() {
  return (
    <div className="text-center flex flex-col items-center
     space-y-2 mt-6 text-[color:#444444]">
      <Package size={40} color="#666666" />
      <span className="text-sm">这里现在还没有文件~</span>
    </div>
  )
}

export default EmptyState
