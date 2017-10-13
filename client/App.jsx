/* global Roles */
import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import 'whatwg-fetch'

import Navbar from './components/Navbar'
import Page404 from './pages/404'
import ApiKeysPage from './pages/ApiKeys'
import ConversationPage from './pages/Conversation'
import ManageUsersPage from './pages/ManageUsers'
import NotificationPage from './pages/Notification'
import NotificationsPage from './pages/Notifications'
import SearchPage from './pages/Search'
import WelcomePage from './pages/Welcome'
import {ROLES} from '../models/user'

class App extends Component {
  render () {
    const {version, isLoading, currentUser, isGuest, isAdmin} = this.props
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
    const [, page, arg1, arg2] = pathname.split('/')
    return (
      <div>
        <Navbar {...{version, currentUser, isGuest, isAdmin}} />
        {isLoading ? null
          : !currentUser || isGuest ? <WelcomePage />
          : pathname === '/' ? <NotificationsPage {...{currentUser, isAdmin}} />
          : pathname === '/search' ? <SearchPage />
          : page === 'conversation' ? <ConversationPage userId={arg1} />
          : page === 'notification' ? <NotificationPage id={arg2} searchBy={arg1} />
          : page === 'manage-users' ? <ManageUsersPage currentUser={currentUser} />
          : page === 'api-keys' ? <ApiKeysPage />
          : <Page404 />}
      </div>
    )
  }
}

App.propTypes = {
  version: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  isGuest: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired
}

export default createContainer(() => {
  Meteor.subscribe('users')
  const currentUser = Meteor.user()
  return {
    isLoading: Meteor.status().status === 'connecting',
    currentUser,
    isGuest: Roles.userIsInRole(currentUser, ROLES.guest),
    isAdmin: Roles.userIsInRole(currentUser, ROLES.admin)
  }
}, App)
