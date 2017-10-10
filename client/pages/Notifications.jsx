import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import {ReactiveVar} from 'meteor/reactive-var'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import FaPause from 'react-icons/lib/fa/pause'
import FaPlay from 'react-icons/lib/fa/play'
import InfiniteScroll from 'react-infinite-scroller'

import NotificationList from '../components/NotificationList'
import {ApiKeys, SCOPES} from '../../models/apikey'
import {Notifications} from '../../models/notification'

const LIMIT = 300
const LIMIT_STEP = 30

class NotificationsPage extends Component {
  constructor (props) {
    super(props)
    this.toggleAutoRefresh = this.toggleAutoRefresh.bind(this)
    this.increaseLimit = this.increaseLimit.bind(this)
  }

  toggleAutoRefresh () {
    this.props.autoRefresh.set(!this.props.autoRefresh.get())
  }

  increaseLimit () {
    const {notificationLimit, autoRefresh} = this.props
    const currentLimit = notificationLimit.get()
    notificationLimit.set(Math.min(currentLimit + LIMIT_STEP, autoRefresh.get() ? LIMIT : Infinity))
  }

  pauseAutoRefreshOnLoad () {
    this.toggleAutoRefresh()
  }

  componentWillReceiveProps (nextProps) {
    if (!this.pausedOnce && nextProps.notifications.length > 0) {
      this.pausedOnce = true
      this.pauseAutoRefreshOnLoad()
    }
  }

  componentWillUnmount () {
    this.pausedOnce = false
  }

  renderCurlExample (apiKey, {profile: {name}}) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const data = {
      id: 'notification-test-1',
      title: 'Test email!',
      channel: 'email',
      datetime: new Date().toISOString(),
      text: 'Hello!\n\nCongratulations, this is your first notification.',
      info: [name],
      user: {id: 'user-test-1', name, email: 'demo@example.com', phone: '+15000000000'},
      details: {subject: 'Test email!', html: '<h1>Hello!</h1>Congratulations, this is your first notification.'},
      events: [{type: 'sent', datetime: new Date().toISOString()}]
    }
    return (
      <div className='border border-info rounded mt-5 w-75 p-4 mx-auto'
        style={{textAlign: 'left', backgroundColor: '#fafafa'}}>
        <h5 className='mb-3'>Send your first one!</h5>
        <code>
          curl -X POST {baseUrl}/api/notification \<br />
          &nbsp;&nbsp;-H 'authorization: {apiKey.token}' \<br />
          &nbsp;&nbsp;-H 'content-type: application/json' \<br />
          &nbsp;&nbsp;-d '{JSON.stringify(data, null, 1)}'
        </code>
      </div>
    )
  }

  renderEmptyList () {
    const {isAdmin, apiKey, currentUser} = this.props
    return (
      <div className='text-center mt-5'>
        <h4>No notification to display yet...</h4>
        <img src='/img/empty.gif' alt='Nothing to display'
          className='w-75 mt-2' style={{maxWidth: '600px'}} />
        {currentUser && isAdmin && apiKey ? this.renderCurlExample(apiKey, currentUser) : null}
      </div>
    )
  }

  render () {
    const {notifications, autoRefresh} = this.props
    const hasMore = notifications.length > 0 && notifications.length >= notificationLimit.get()
    return (
      <div className='notifications-page container mt-3'>
        <div className='notification-list'>
          <div className='sticky-top clearfix' style={{zIndex: 10, top: '84px'}}>
            <button className='btn btn-outline-info float-right' onClick={this.toggleAutoRefresh}>
              {autoRefresh.get() ? <FaPause /> : <FaPlay />}
              <span className='text d-none d-md-inline'>
                {autoRefresh.get() ? 'Deactivate auto-refresh' : 'Activate auto-refresh'}
              </span>
            </button>
          </div>
          <div className='row'>
            <div className='col-12'>
              {notifications.length === 0 ? this.renderEmptyList() : (
                <span>
                  <InfiniteScroll loadMore={this.increaseLimit} hasMore={hasMore}>
                    <NotificationList notifications={notifications} />
                  </InfiniteScroll>
                  <button className='list-end btn btn-outline-info w-75 d-block mx-auto'>
                    {autoRefresh.get() && notifications.length === LIMIT
                      ? `Pause auto-refresh to display more than ${LIMIT} notifications.`
                      : hasMore ? 'Loading...'
                      : 'At the end.'}
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

NotificationsPage.propTypes = {
  notifications: PropTypes.array.isRequired,
  notificationLimit: PropTypes.object.isRequired,
  autoRefresh: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  isAdmin: PropTypes.bool,
  apiKey: PropTypes.object
}

const notificationLimit = new ReactiveVar(LIMIT_STEP)
const autoRefresh = new ReactiveVar(true)

export default createContainer(({isAdmin}) => {
  Meteor.subscribe('notifications')
  const notifications = Notifications.find({}, {
    sort: {datetime: -1},
    limit: notificationLimit.get(),
    reactive: autoRefresh.get()
  }).fetch()
  let apiKey = null
  if (isAdmin && notifications.length === 0) {
    Meteor.subscribe('apikeys')
    apiKey = ApiKeys.findOne({scopes: {$in: [SCOPES.write]}})
  }
  return {
    notifications,
    notificationLimit,
    autoRefresh,
    apiKey
  }
}, NotificationsPage)
