import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import DateFromNow from '../components/DateFromNow'
import {ApiKeys} from '../../models/apikey'

// TODO v2: add, remove, and make api keys expire

class ApiKeysPage extends Component {
  render () {
    const {apiKeys} = this.props
    return (
      <div className='apikeys-page container mt-5'>
        <table className='table table-responsive'>
          <thead>
            <tr>
              <th>Token</th>
              <th>Scopes</th>
              <th>Created</th>
              <th>By</th>
              <th>Expiration</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map(({token, scopes, createdAt, byUser, expireAt}) => (
              <tr key={token}>
                <td><code>{token}</code></td>
                <td>{scopes.join(', ')}</td>
                <td><DateFromNow date={createdAt} /></td>
                <td>{byUser.name}</td>
                <td>{expireAt ? <DateFromNow date={expireAt} /> : 'never'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

ApiKeysPage.propTypes = {
  apiKeys: PropTypes.array.isRequired
}

export default createContainer(() => {
  Meteor.subscribe('apikeys')
  return {
    apiKeys: ApiKeys.find({}, {sort: {createdAt: -1}}).fetch()
  }
}, ApiKeysPage)
