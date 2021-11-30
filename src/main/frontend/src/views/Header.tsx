import { Popover, Tag } from '@geist-ui/react'
import { ChevronUpDown } from '@geist-ui/react-icons'
import React from 'react'
import { useAuth } from '../context/auth-context'
import logo from '../logo.svg'

const Header = () => {
  const { user, logout } = useAuth()

  const operations = [
    {
      title: '退出登录',
      className: 'text-red-600',
      fn: () => logout!(),
    },
  ]

  const popoverContent = () => {
    return (
      <ul>
        {operations.map(({ title, className, fn }) => (
          <li
            onClick={fn}
            key={title}
            className="text-[color:#444444] text-sm cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-[#fafafa]">
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
  }

  return (
    <div className="container mx-auto py-4 flex justify-between items-center">
      <a href="/" className="flex items-center">
        <img className="mr-2" src={logo} alt="logo" />
        HDFS Cloud
      </a>
      <div className="flex items-center space-x-2">
        <Tag type="default" invert>
          {user!.username}
        </Tag>
        <Popover className="popover" content={popoverContent}>
          <ChevronUpDown size="18" className="cursor-pointer" />
          <style scoped>{`
      .popover .tooltip-content .inner {
          padding: 0.25rem 0 !important;
        }
      `}</style>
        </Popover>
      </div>
    </div>
  )
}

export default Header
