import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import DateFromNow from '../components/DateFromNow'
import {ROLES} from '../../models/user'

class ManageUsersPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      changeRoleUser: null
    }
    this.displayRoleForm = this.displayRoleForm.bind(this)
    this.updateRole = this.updateRole.bind(this)
  }

  displayRoleForm (event) {
    const {userid} = event.target.dataset
    this.setState({changeRoleUser: userid})
  }

  updateRole (event) {
    const {dataset: {userid}, value} = event.target
    Meteor.call('user.setRole', userid, value)
    this.setState({changeRoleUser: null})
  }

  renderChangeRoleAction (userId, userRole) {
    const {changeRoleUser} = this.state
    return changeRoleUser === userId ? (
      <div className='form-group' style={{marginBottom: 0}}>
        <select multiple className='form-control' defaultValue={[userRole]}
          size={Object.keys(ROLES).length} style={{overflow: 'auto'}}>
          {Object.keys(ROLES).map((role) =>
            <option key={role} value={role} data-userid={userId} onClick={this.updateRole}>
              {role}
            </option>
          )}
        </select>
      </div>
    ) : (
      <button className='btn btn-outline-info' data-userid={userId} onClick={this.displayRoleForm}>
        Change user role
      </button>
    )
  }

  render () {
    const {currentUser, users} = this.props
    return (
      <div className='apikeys-page container mt-5'>
        <table className='table table-responsive'>
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th />
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
                  <td>{currentUser._id === _id ? null : this.renderChangeRoleAction(_id, role)}</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

ManageUsersPage.propTypes = {
  currentUser: PropTypes.object,
  users: PropTypes.array.isRequired
}

export default createContainer(() => {
  Meteor.subscribe('users.all')
  return {
    users: Meteor.users.find({}, {sort: {createdAt: -1}}).fetch()
  }
}, ManageUsersPage)
