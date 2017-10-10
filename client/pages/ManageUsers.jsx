import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import DateFromNow from '../components/DateFromNow'
import {ROLES} from '../../models/user'

class ManageUsersPage extends Component {
  render () {
    const {users} = this.props
    return (
      <div className='apikeys-page container mt-5'>
        <table className='table'>
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(({createdAt}) => createdAt)
              .map(({_id, email, profile: {name, picture}, createdAt, roles: [role]}) =>
                <tr key={_id}
                  className={role === ROLES.admin ? 'table-info' : role === ROLES.guest ? 'table-secondary' : ''}>
                  <td><img src={picture} className='picture rounded-circle' width='50' height='50' /></td>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td><code>{role}</code></td>
                  <td><DateFromNow date={createdAt} /></td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

ManageUsersPage.propTypes = {
  users: PropTypes.array.isRequired
}

export default createContainer(() => {
  Meteor.subscribe('users.all')
  return {
    users: Meteor.users.find({}, {sort: {createdAt: -1}}).fetch()
  }
}, ManageUsersPage)
