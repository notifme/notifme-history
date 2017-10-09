import PropTypes from 'prop-types'
import React, {Component} from 'react'

import ReadableJson from './ReadableJson'

export default class UserCard extends Component {
  renderUser ({_id, score, ...user}) {
    return <ReadableJson object={user} />
  }

  render () {
    const {userId, user} = this.props
    return (
      <div className='user-card card'>
        <div className='card-body'>
          <h4 className='card-title'>
            <a className='no-link' href={`/conversation/${userId}`}>User #{userId}</a>
          </h4>
          <p className='card-text'>
            {user ? this.renderUser(user) : `Loading information...`}
          </p>
        </div>
      </div>
    )
  }
}

UserCard.propTypes = {
  userId: PropTypes.string.isRequired,
  user: PropTypes.object
}
