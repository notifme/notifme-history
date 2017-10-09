import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import NotificationList from '../components/NotificationList.jsx'
import UserInfo from '../components/UserInfo'
import {Notifications} from '../../models/notification'
import {NotificationUsers} from '../../models/notificationUser'

class ConversationPage extends Component {
  renderUser () {
    const {userId, user} = this.props
    return (
      <div className='card'>
        <div className='card-body'>
          <h4 className='card-title'>User #{userId}</h4>
          <p className='card-text'>
            {user
              ? Object.keys(user).filter((key) => !['_id', 'score'].includes(key)).map((key) =>
                <UserInfo key={key} keyName={key} value={user[key]} />)
              : `Loading conversation...`}
          </p>
        </div>
      </div>
    )
  }

  render () {
    const {notifications} = this.props
    return (
      <div className='conversation-page notification-page container'>
        <div className='row'>
          <div className='col' />
          <div className='col-sm-6 mt-3 mb-4'>
            {this.renderUser()}
          </div>
          <div className='col' />
        </div>
        <div className='notification-list'>
          <NotificationList notifications={notifications} />
        </div>
      </div>
    )
  }
}

ConversationPage.propTypes = {
  user: PropTypes.object,
  notifications: PropTypes.array.isRequired
}

export default createContainer(({userId}) => {
  Meteor.subscribe('notificationusers.get', userId)
  Meteor.subscribe('notifications.user', userId)
  return {
    user: NotificationUsers.findOne(),
    notifications: Notifications.find({}, {sort: {datetime: -1}}).fetch()
  }
}, ConversationPage)
