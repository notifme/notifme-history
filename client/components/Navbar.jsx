/* global Roles */
import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {slide as Menu} from 'react-burger-menu'
import FaAreaChart from 'react-icons/lib/fa/area-chart'
import FaHome from 'react-icons/lib/fa/home'
import FaKey from 'react-icons/lib/fa/key'
import FaSearch from 'react-icons/lib/fa/search'
import FaUsers from 'react-icons/lib/fa/user'

import AccountsUIWrapper from './AccountsUIWrapper.jsx'
import {ROLES} from '../../models/user'

class Navbar extends Component {
  renderMenu () {
    const {currentUser, isGuest} = this.props
    return (
      <div className='menu'>
        <Menu right>
          <div className='user'>
            {currentUser.profile.picture
              ? <img src={currentUser.profile.picture} className='picture rounded-circle'
                width='70' height='70' />
              : null}
            <AccountsUIWrapper />
            {isGuest ? (
              <div className='pending'>(pending validation)</div>
            ) : null}
          </div>
        </Menu>
      </div>
    )
  }

  render () {
    const {currentUser} = this.props
    return (
      <nav className='navbar sticky-top navbar-dark bg-dark'>
        <div className='container'>
          <a className='navbar-brand' href='/'>
            <img src='/img/logo.svg' className='rounded p-1' width='40' height='40' alt='Logo' />
          </a>
          {currentUser ? this.renderMenu() : <AccountsUIWrapper />}
        </div>
      </nav>
    )
  }
}

Navbar.propTypes = {
  currentUser: PropTypes.object,
  isAdmin: PropTypes.bool,
  isGuest: PropTypes.bool
}

export default createContainer(() => {
  Meteor.subscribe('users')
  const currentUser = Meteor.user()
  return {
    currentUser,
    isAdmin: Roles.userIsInRole(currentUser, ROLES.admin),
    isGuest: Roles.userIsInRole(currentUser, ROLES.guest)
  }
}, Navbar)
