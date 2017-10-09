import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import NotificationList from '../components/NotificationList.jsx'
import UserInfo from '../components/UserInfo'
import {Notifications} from '../../models/notification'
import {NotificationUsers} from '../../models/notificationUser'

class ConversationPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedChannel: null
    }
    this.filterChannel = this.filterChannel.bind(this)
  }

  filterChannel (event) {
    const {channel} = event.target.dataset
    this.setState({selectedChannel: channel === 'total' ? null : channel})
  }

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

  renderCountsByChannel () {
    const {notifications} = this.props
    const {selectedChannel} = this.state
    return Object.values(notifications.reduce((counts, {channel}) => {
      if (!counts[channel]) counts[channel] = {channel, number: 0}
      counts[channel].number++
      return counts
    }, {total: {channel: 'total', number: notifications.length}})).map(({channel, number}, i) =>
      <span key={channel} data-channel={channel} onClick={this.filterChannel}
        className={`badge ${i === 0 ? 'badge-info' : 'badge-secondary'} ${channel === selectedChannel ? 'selected' : ''}`}>
        {channel}: {number}
      </span>)
  }

  render () {
    const {notifications} = this.props
    const {selectedChannel} = this.state
    const filteredNotifications = selectedChannel
      ? notifications.filter(({channel}) => channel === selectedChannel)
      : notifications
    return (
      <div className='conversation-page notifications-page container'>
        <div className='row'>
          <div className='col' />
          <div className='col-md-8 col-lg-6 mt-3 mb-4'>
            {this.renderUser()}
          </div>
          <div className='col' />
        </div>
        <div className='channel-badges'>
          {this.renderCountsByChannel()}
        </div>
        <div className='notification-list'>
          <NotificationList notifications={filteredNotifications} />
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
    notifications: userId ? Notifications.find({}, {sort: {datetime: -1}}).fetch() : []
  }
}, ConversationPage)
