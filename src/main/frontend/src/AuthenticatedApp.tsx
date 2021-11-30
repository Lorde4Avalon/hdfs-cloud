import React from 'react'
import Home from './pages/Home'
import Header from './views/Header'
import Navigation from './views/Navigation'

function App() {
  return (
    <div className="app">
      <Header />
      <Navigation />
      <div className="container mx-auto">
        <Home />
      </div>
    </div>
  )
}

export default App
