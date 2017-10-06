/* global Roles */
import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import AccountsUIWrapper from './AccountsUIWrapper.jsx'
import Notifications from './Notifications.jsx'
import {ROLES} from '../../models/user'

class App extends Component {
  render () {
    const {currentUser, isAdmin, isMember} = this.props
    return (
      <div>
        <nav className='navbar sticky-top navbar-dark bg-dark'>
          <div className='container'>
            <a className='navbar-brand' href='/'>
              <img src='/img/logo.svg' className='rounded p-1' width='40' height='40' alt='Logo' />
            </a>
            <div>
              {currentUser && currentUser.profile.picture
                ? <img src={currentUser.profile.picture} className='rounded-circle' width='40' height='40' />
                : null}
              <AccountsUIWrapper />
            </div>
          </div>
        </nav>
        <div className='container'>
          {isAdmin || isMember ? <Notifications /> : null}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  currentUser: PropTypes.object,
  isAdmin: PropTypes.bool,
  isMember: PropTypes.bool
}

export default createContainer(() => {
  Meteor.subscribe('users')
  const currentUser = Meteor.user()
  return {
    currentUser,
    isAdmin: Roles.userIsInRole(currentUser, ROLES.admin),
    isMember: Roles.userIsInRole(currentUser, ROLES.member)
  }
}, App)
