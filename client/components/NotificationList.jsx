import PropTypes from 'prop-types'
import React, {Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import nl2br from 'react-nl2br'

import DateFromNow from '../components/DateFromNow'

export default class NotificationList extends Component {
  render () {
    const {notifications} = this.props
    return (
      <ReactCSSTransitionGroup component='ul' className='timeline timeline-centered'
        transitionName='fade' transitionEnterTimeout={400} transitionLeaveTimeout={200}>
        {notifications.map(({_id, id, datetime, channel, title, text, info, userId}) => (
          <li key={_id} className='timeline-item left'>
            <a className='timeline-info' href={userId ? `/conversation/${userId}` : null}>
              <div className='datetime'>
                <DateFromNow date={datetime.toISOString()} />
              </div>
              <div>
                {(info || []).map((infoChunk, i) => (
                  <span key={i} className='badge badge-pill badge-secondary'>{infoChunk}</span>
                ))}
                <span className='channel badge badge-pill badge-info'>{channel}</span>
              </div>
            </a>
            <div className='timeline-marker' />
            <a className='timeline-content' href={`/notification/${id ? `id/${id}` : `_id/${_id}`}`}>
              <h3 className='timeline-title'>{title}</h3>
              <p>{nl2br(text)}</p>
            </a>
          </li>
        ))}
      </ReactCSSTransitionGroup>
    )
  }
}

NotificationList.propTypes = {
  notifications: PropTypes.array.isRequired
}
