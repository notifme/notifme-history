import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import Notification from './Notification.jsx'
import {Notifications} from '../../models/notification.js'

class App extends Component {
  renderNotifications () {
    return this.props.notifications.map((notification) => (
      <Notification key={notification._id} notification={notification} />
    ))
  }

  render () {
    return (
      <div className='container'>
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
  notifications: PropTypes.array.isRequired
}

export default createContainer(() => ({
  notifications: Notifications.find({}, {sort: {createdAt: -1}}).fetch()
}), App)
