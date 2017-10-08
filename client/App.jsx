/* global Roles */
import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import Navbar from './components/Navbar.jsx'
import Page404 from './pages/404.jsx'
import ConversationPage from './pages/Conversation.jsx'
import NotificationsPage from './pages/Notifications.jsx'
import SearchPage from './pages/Search.jsx'
import WelcomePage from './pages/Welcome.jsx'
import {ROLES} from '../models/user'

class App extends Component {
  render () {
    const {isLoading, currentUser, isGuest} = this.props
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
    const [, page, argument] = pathname.split('/')
    return (
      <div>
        <Navbar />
        {isLoading ? null
          : !currentUser || isGuest ? <WelcomePage />
          : pathname === '/' ? <NotificationsPage />
          : pathname === '/search' ? <SearchPage />
          : page === 'conversation' ? <ConversationPage userId={argument} />
          : <Page404 />}
      </div>
    )
  }
}

App.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  isGuest: PropTypes.bool.isRequired
}

export default createContainer(() => {
  Meteor.subscribe('users')
  const currentUser = Meteor.user()
  return {
    isLoading: Meteor.status().status === 'connecting',
    currentUser,
    isGuest: Roles.userIsInRole(currentUser, ROLES.guest)
  }
}, App)
