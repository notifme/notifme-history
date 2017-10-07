/* global Roles */
import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import Navbar from './Navbar.jsx'
import Notifications from './Notifications.jsx'
import {ROLES} from '../../models/user'

class App extends Component {
  render () {
    const {isAdmin, isMember} = this.props
    return (
      <div>
        <Navbar />
        <div className='container'>
          {isAdmin || isMember ? <Notifications /> : null}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  isAdmin: PropTypes.bool,
  isMember: PropTypes.bool
}

export default createContainer(() => {
  Meteor.subscribe('users')
  const currentUser = Meteor.user()
  return {
    isAdmin: Roles.userIsInRole(currentUser, ROLES.admin),
    isMember: Roles.userIsInRole(currentUser, ROLES.member)
  }
}, App)
