import { Tabs } from '@geist-ui/react'
import React from 'react'

const Navigation = () => (
  <div className="container mx-auto pb-8 after:w-screen after:border-b after:border-[#eaeaea] after:absolute after:left-0">
    <Tabs hideDivider height="48px" initialValue="1">
      <Tabs.Item height="48px" label="主页" value="1"></Tabs.Item>
      <Tabs.Item height="48px" label="设置" value="2"></Tabs.Item>
    </Tabs>
  </div>
)

export default Navigation
