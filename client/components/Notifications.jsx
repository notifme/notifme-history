import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import nl2br from 'react-nl2br'

import DateFromNow from './DateFromNow.jsx'
import {Notifications} from '../../models/notification.js'

class App extends Component {
  render () {
    return (
      <div className='notification-list-container'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12'>
              <ReactCSSTransitionGroup component='ul' className='timeline timeline-centered'
                transitionName='fade' transitionEnterTimeout={400} transitionLeaveTimeout={200}>
                {this.props.notifications.map((notification) => (
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  notifications: PropTypes.array.isRequired
}

export default createContainer(() => {
  return {
    notifications: Notifications.find({}, {sort: {datetime: -1}, limit: 30}).fetch()
  }
}, App)
