import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import AccountsUIWrapper from './AccountsUIWrapper.jsx'
import Notification from './Notification.jsx'
import {Notifications} from '../../models/notification.js'

class App extends Component {
  renderNotifications () {
    return this.props.notifications.map((notification) => (
      <Notification key={notification._id} notification={notification} />
    ))
  }

  render () {
    const {currentUser} = this.props
    return (
      <div className='container'>
        {currentUser && currentUser.profile.picture
          ? <img src={currentUser.profile.picture} style={{width: 50}} />
          : null}
        <AccountsUIWrapper />

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

export default createContainer(() => ({
  notifications: Notifications.find({}, {sort: {createdAt: -1}}).fetch(),
  currentUser: Meteor.user()
}), App)
