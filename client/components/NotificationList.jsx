import dateFormat from 'date-fns/format'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import nl2br from 'react-nl2br'

import DateFromNow from './DateFromNow'

export default class NotificationList extends Component {
  getEventsString (events) {
    return events
      ? events.reduce((eventList, {type, datetime}) => {
        return eventList.concat(`${type}: ${dateFormat(datetime, 'D MMMM YYYY h:mm A')}`)
      }, []).join('\n')
      : ''
  }

  render () {
    const {notifications} = this.props
    return (
      <ReactCSSTransitionGroup component='ul' className='timeline timeline-centered marker-outline'
        transitionName='fade' transitionEnterTimeout={400} transitionLeaveTimeout={200}>
        {notifications.map(({_id, id, datetime, channel, title, text, info, userId, events, isFromUser}) => (
          <li key={_id} className={`timeline-item ${isFromUser ? 'right' : 'left'}`}>
            <div className='timeline-info'>
              <a className='no-link' href={userId ? `/conversation/${userId}` : null}>
                <div className='datetime'>
                  <DateFromNow date={datetime.toISOString()} />
                </div>
                <div>
                  {(info || []).map((infoChunk, i) => (
                    <span key={i} className='badge badge-pill badge-secondary'>{infoChunk}</span>
                  ))}
                  <span className='channel badge badge-pill badge-info' title={this.getEventsString(events)}>
                    {channel}
                  </span>
                </div>
              </a>
            </div>
            <div className='timeline-marker' />
            <div className='timeline-content'>
              <a className='no-link' href={`/notification/${id ? `id/${id}` : `_id/${_id}`}`}>
                <h3 className='timeline-title'>{title}</h3>
                <p>{nl2br(text)}</p>
              </a>
            </div>
          </li>
        ))}
      </ReactCSSTransitionGroup>
    )
  }
}

NotificationList.propTypes = {
  notifications: PropTypes.array.isRequired
}
