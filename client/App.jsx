/* global Roles */
import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import Navbar from './components/Navbar.jsx'
import Notifications from './pages/Notifications.jsx'
import Page404 from './pages/404.jsx'
import WelcomePage from './pages/Welcome.jsx'
import {ROLES} from '../models/user'

class App extends Component {
  render () {
    const {currentUser, isGuest} = this.props
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
    return (
      <div>
        <Navbar />
        {!currentUser || isGuest ? <WelcomePage />
          : pathname === '/' ? <Notifications />
          : <Page404 />}
      </div>
    )
  }
}

App.propTypes = {
  currentUser: PropTypes.object,
  isGuest: PropTypes.bool.isRequired
}

export default createContainer(() => {
  Meteor.subscribe('users')
  const currentUser = Meteor.user()
  return {
    currentUser,
    isGuest: Roles.userIsInRole(currentUser, ROLES.guest)
  }
}, App)
