import React, {Component} from 'react'

import Navbar from './components/Navbar.jsx'
import Notifications from './pages/Notifications.jsx'

export default class App extends Component {
  render () {
    return (
      <div>
        <Navbar />
        <div className='container'>
          <Notifications />
        </div>
      </div>
    )
  }
}
