import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {slide as Menu} from 'react-burger-menu'
// import FaAreaChart from 'react-icons/lib/fa/area-chart'
import FaHome from 'react-icons/lib/fa/home'
import FaKey from 'react-icons/lib/fa/key'
import FaSearch from 'react-icons/lib/fa/search'
import FaUsers from 'react-icons/lib/fa/user'

import AccountsUIWrapper from './AccountsUIWrapper'

export default class Navbar extends Component {
  renderMenu () {
    const {currentUser, isGuest, isAdmin} = this.props
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
          {isGuest ? null : (
            <div>
              <hr />
              <a className='menu-item no-link' href='/'><FaHome /> Home</a>
              <a className='menu-item no-link' href='/search'><FaSearch /> Search</a>
              {/* TODO v2: <a className='menu-item no-link' href='/statistics'><FaAreaChart /> Statistics</a> */}
            </div>
          )}
          {isAdmin ? (
            <div>
              <hr />
              <a className='menu-item no-link' href='/manage-users'><FaUsers /> Manage users</a>
              <a className='menu-item no-link' href='/api-keys'><FaKey /> API keys</a>
            </div>
          ) : null}
        </Menu>
      </div>
    )
  }

  render () {
    const {currentUser} = this.props
    return (
      <nav className='navbar sticky-top navbar-dark bg-dark'>
        <div className='container'>
          <a className='navbar-brand no-link' href='/'>
            <img src='/img/logo.svg' className='rounded p-1' width='42' height='42' alt='Logo' />
          </a>
          {currentUser ? <a className='search no-link' href='/search'><FaSearch /></a> : null}
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
