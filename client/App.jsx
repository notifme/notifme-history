import React, {Component} from 'react'

import Navbar from './components/Navbar.jsx'
import Notifications from './pages/Notifications.jsx'
import Page404 from './pages/404.jsx'

export default class App extends Component {
  render () {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
    return (
      <div>
        <Navbar />
        {pathname === '/' ? <Notifications />
          : <Page404 />}
      </div>
    )
  }
}
