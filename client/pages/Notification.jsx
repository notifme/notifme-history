import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import NotificationList from '../components/NotificationList'
import UserCard from '../components/UserCard'
import JsonInfo from '../components/JsonInfo'
import {Notifications} from '../../models/notification'
import {NotificationDetails} from '../../models/notificationDetail'
import {NotificationUsers} from '../../models/notificationUser'

class NotificationPage extends Component {
  render () {
    const {notification, details, user} = this.props
    if (!notification) return null
    return (
      <div className='notification-page container'>
        <div className='notification-list'>
          <NotificationList notifications={[notification]} />
        </div>
        {user ? (
          <div className='row'>
            <div className='col' />
            <div className='col-md-8 col-lg-6 mt-3 mb-4'>
              <UserCard userId={user.id} user={user} />
            </div>
            <div className='col' />
          </div>
        ) : null}
        {details ? (
          <div className='notification-details-card card'>
            <div className='card-body'>
              <h4 className='card-title'>Notification #{details.id || details.notificationId}</h4>
              <p className='card-text'>
                {Object.keys(details).filter((key) => !['_id', 'notificationId'].includes(key))
                  .map((key) => <JsonInfo key={key} keyName={key} value={details[key]} />)}
              </p>
            </div>
          </div>
        ) : null}
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
