import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import NotificationList from '../components/NotificationList'
import ReadableJson from '../components/ReadableJson'
import UserCard from '../components/UserCard'
import {Notifications} from '../../models/notification'
import {NotificationDetails} from '../../models/notificationDetail'
import {NotificationUsers} from '../../models/notificationUser'

class NotificationPage extends Component {
  renderUser (user) {
    return (
      <div className='row'>
        <div className='col' />
        <div className='col-md-8 col-lg-6 mt-3 mb-4'>
          <UserCard userId={user.id} user={user} />
        </div>
        <div className='col' />
      </div>
    )
  }

  renderDetails ({_id, notificationId, ...details}) {
    return (
      <div className='notification-details-card card'>
        <div className='card-body'>
          <h4 className='card-title'>Notification #{details.id || notificationId}</h4>
          <p className='card-text'>
            <ReadableJson object={details} />
          </p>
        </div>
      </div>
    )
  }

  render () {
    const {notification, details, user} = this.props
    if (!notification) return null
    return (
      <div className='notification-page container'>
        <div className='notification-list'>
          <NotificationList notifications={[notification]} />
        </div>
        {user ? this.renderUser(user) : null}
        {details ? this.renderDetails(details) : null}
      </div>
    )
  }
}

NotificationPage.propTypes = {
  id: PropTypes.string.isRequired,
  searchBy: PropTypes.string.isRequired,
  notification: PropTypes.object,
  details: PropTypes.object,
  user: PropTypes.object
}

export default createContainer(({searchBy, id}) => {
  Meteor.subscribe('notifications.getWithDetail', searchBy, id)
  return {
    notification: Notifications.findOne(),
    details: NotificationDetails.findOne(),
    user: NotificationUsers.findOne()
  }
}, NotificationPage)
