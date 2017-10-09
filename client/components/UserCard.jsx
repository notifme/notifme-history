import PropTypes from 'prop-types'
import React, {Component} from 'react'

import JsonInfo from './JsonInfo'

export default class UserCard extends Component {
  render () {
    const {userId, user} = this.props
    return (
      <div className='user-card card'>
        <div className='card-body'>
          <h4 className='card-title'>User #{userId}</h4>
          <p className='card-text'>
            {user
              ? Object.keys(user).filter((key) => !['_id', 'score'].includes(key)).map((key) =>
                <JsonInfo key={key} keyName={key} value={user[key]} />)
              : `Loading information...`}
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
