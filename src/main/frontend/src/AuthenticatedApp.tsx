import React from 'react'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Header from './views/Header'
import Navigation from './views/Navigation'

function App() {
  const tabs: Tab[] = [
    {
      label: '主页',
      value: 'home',
      content: <Home />,
    },
    {
      label: '设置',
      value: 'settings',
      content: <Settings />,
    },
  ]
  return (
    <div className="app">
      <Header />
      <Navigation tabs={tabs} initialValue="home" />
    </div>
  )
}

export default App
