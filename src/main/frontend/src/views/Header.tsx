import React from 'react'
import logo from '../logo.svg'

const Header = () => (
  <div className="container mx-auto py-4">
    <a href="/" className="flex items-center">
      <img className="mr-2" src={logo} alt="logo" />
      HDFS Cloud
    </a>
  </div>
)

export default Header
