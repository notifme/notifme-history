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
    const {currentUser, isAdmin} = this.props
    return (
      <div className='container'>
        {currentUser && currentUser.profile.picture
          ? <img src={currentUser.profile.picture} style={{width: 50}} />
          : null}
        <AccountsUIWrapper />
        {isAdmin ? ' (admin!)' : null}

        <Notifications />
      </div>
    )
  }
}

App.propTypes = {
  currentUser: PropTypes.object
}

export default createContainer(() => {
  const currentUser = Meteor.user()
  return {
    currentUser,
    isAdmin: Roles.userIsInRole(currentUser, ROLES.admin)
  }
}, App)
