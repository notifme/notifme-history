/* global Roles */
import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import AccountsUIWrapper from './AccountsUIWrapper.jsx'
import Notification from './Notification.jsx'
import {Notifications} from '../../models/notification.js'
import {ROLES} from '../../models/user'

class App extends Component {
  renderNotifications () {
    return this.props.notifications.map((notification) => (
      <Notification key={notification._id} notification={notification} />
    ))
  }

  render () {
    const {currentUser, isAdmin} = this.props
    return (
      <div className='container'>
        {currentUser && currentUser.profile.picture
          ? <img src={currentUser.profile.picture} style={{width: 50}} />
          : null}
        <AccountsUIWrapper />
        {isAdmin ? ' (admin!)' : null}

        <header>
          <h1>Notifications</h1>
        </header>

        <ul>
          {this.renderNotifications()}
        </ul>
      </div>
    )
  }
}

App.propTypes = {
  notifications: PropTypes.array.isRequired,
  currentUser: PropTypes.object
}

export default createContainer(() => {
  const currentUser = Meteor.user()
  return {
    notifications: Notifications.find({}, {sort: {createdAt: -1}}).fetch(),
    currentUser,
    isAdmin: Roles.userIsInRole(currentUser, ROLES.admin)
  }
}, App)
