import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import DateFromNow from '../components/DateFromNow'
import NotificationList from '../components/NotificationList'
import ReadableJson from '../components/ReadableJson'
import UserCard from '../components/UserCard'
import {Notifications} from '../../models/notification'
import {NotificationDetails} from '../../models/notificationDetail'
import {NotificationUsers} from '../../models/notificationUser'

class NotificationPage extends Component {
  renderUser (user) {
    return <UserCard userId={user.id} user={user} />
  }

  renderEvents (events) {
    if (events.length < 1) return null
    return (
      <div className='notification-events-card card mt-3'>
        <div className='card-body'>
          <h4 className='card-title'>Events</h4>
          <div className='card-text'>
            <table className='table table-responsive'>
              <tbody>
                {events.map(({type, datetime, info}, i) =>
                  <tr key={`${type}-${i}`}>
                    <td><code>{type}</code></td>
                    <td>{<DateFromNow date={datetime} />}</td>
                    <td>{info}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  renderDetails ({_id, notificationId, ...details}) {
    // TODO v2: try to display details in a better way given the notification type
    return (
      <div className='notification-details-card card mt-3'>
        <div className='card-body'>
          <h4 className='card-title'>Details</h4>
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
      <div className='notification-page container mt-5'>
        <div className='notification-list'>
          <NotificationList notifications={[notification]} />
        </div>
        <div className='container-fluid'>
          {user ? this.renderUser(user) : null}
          {notification && notification.events ? this.renderEvents(notification.events) : null}
          {details ? this.renderDetails(details) : null}
        </div>
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
