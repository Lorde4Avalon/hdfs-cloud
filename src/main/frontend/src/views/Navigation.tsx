import { Tabs } from '@geist-ui/react'
import React from 'react'

interface Props {
  tabs: Tab[]
  initialValue: Tab['value']
}

const Navigation = ({ tabs, initialValue }: Props) => (
  <div
    className="container mx-auto pb-8 after:w-screen after:border-b
   after:border-[#eaeaea] after:absolute after:left-0">
    <Tabs hideDivider height="48px" initialValue={initialValue}>
      {tabs.map((tab) => (
        <Tabs.Item
          height="48px"
          key={tab.value}
          label={tab.label}
          value={tab.value}>
          {tab.content}
        </Tabs.Item>
      ))}
    </Tabs>
  </div>
)

export default Navigation
