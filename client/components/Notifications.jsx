import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import {ReactiveVar} from 'meteor/reactive-var'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import FaPause from 'react-icons/lib/fa/pause'
import FaPlay from 'react-icons/lib/fa/play'
import InfiniteScroll from 'react-infinite-scroller'
import nl2br from 'react-nl2br'

import DateFromNow from './DateFromNow.jsx'
import {Notifications} from '../../models/notification.js'

const LIMIT = 300
const LIMIT_STEP = 30

class App extends Component {
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

  render () {
    const {notifications, autoRefresh} = this.props
    const hasMore = notifications.length > 0 && notifications.length >= notificationLimit.get()
    return (
      <div className='notification-list-container'>
        <div className='container-fluid'>
          <div className='clearfix'>
            <button className='btn btn-outline-info float-right' onClick={this.toggleAutoRefresh}>
              {autoRefresh.get() ? <FaPause /> : <FaPlay />}
              <span className='text'>
                {autoRefresh.get() ? 'Deactivate auto-refresh' : 'Activate auto-refresh'}
              </span>
            </button>
          </div>
          <div className='row'>
            <div className='col-12'>
              <InfiniteScroll loadMore={this.increaseLimit} hasMore={hasMore}>
                <ReactCSSTransitionGroup component='ul' className='timeline timeline-centered'
                  transitionName='fade' transitionEnterTimeout={400} transitionLeaveTimeout={200}>
                  {notifications.map((notification) => (
                    <li key={notification._id} className='timeline-item left'>
                      <div className='timeline-info'>
                        <DateFromNow date={notification.datetime.toISOString()} />
                      </div>
                      <div className='timeline-marker' />
                      <div className='timeline-content'>
                        <h3 className='timeline-title'>{notification.title}</h3>
                        <p>{nl2br(notification.text)}</p>
                      </div>
                    </li>
                  ))}
                </ReactCSSTransitionGroup>
              </InfiniteScroll>
              <button className='list-end btn btn-outline-info w-75 d-block mx-auto'>
                {notifications.length === 0 ? 'No notification to display.'
                  : autoRefresh.get() && notifications.length === LIMIT
                    ? `Pause auto-refresh to display more than ${LIMIT} notifications.`
                  : hasMore ? 'Loading...'
                  : 'At the end.'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  notifications: PropTypes.array.isRequired,
  notificationLimit: PropTypes.object.isRequired,
  autoRefresh: PropTypes.object.isRequired
}

const notificationLimit = new ReactiveVar(LIMIT_STEP)
const autoRefresh = new ReactiveVar(true)

export default createContainer(() => {
  Meteor.subscribe('notifications')
  const notifications = Notifications.find({}, {
    sort: {datetime: -1},
    limit: notificationLimit.get(),
    reactive: autoRefresh.get()
  }).fetch()
  return {
    notifications,
    notificationLimit,
    autoRefresh
  }
}, App)
