import {Meteor} from 'meteor/meteor'
import {createContainer} from 'meteor/react-meteor-data'
import {ReactiveVar} from 'meteor/reactive-var'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import FaSearch from 'react-icons/lib/fa/search'

import JsonInfo from '../components/JsonInfo'
import {NotificationUsers} from '../../models/notificationUser'

class SearchPage extends Component {
  constructor (props) {
    super(props)
    this.onInputChange = this.onInputChange.bind(this)
  }

  onInputChange (event) {
    this.props.searchInput.set(event.target.value)
  }

  renderForm () {
    return (
      <form className='form-inline d-inline'>
        <div className='input-group'>
          <input type='text' className='form-control' onChange={this.onInputChange}
            placeholder='Search by user info' />
          <span className='input-group-addon'><FaSearch /></span>
        </div>
      </form>
    )
  }

  renderUsers () {
    const {users, searchInput} = this.props
    const searchWords = searchInput.get().split(/ |-/)
    return (
      <div className='users'>
        {users.map((user) => (
          <div key={user._id} className='user-info'>
            <hr />
            <a href={`/conversation/${user.id}`}>
              {Object.keys(user).filter((key) => !['_id', 'score'].includes(key)).map((key) =>
                <JsonInfo {...{key, keyName: key, value: user[key], searchWords}} />)}
            </a>
          </div>
        ))}
        {users.length ? <hr /> : null}
      </div>
    )
  }

  render () {
    return (
      <div className='search-page container'>
        <div className='row'>
          <div className='col' />
          <div className='col-xs-12 col-md-6'>
            {this.renderForm()}
          </div>
          <div className='col' />
        </div>
        <div className='row'>
          <div className='col'>
            {this.renderUsers()}
          </div>
        </div>
      </div>
    )
  }
}

SearchPage.propTypes = {
  users: PropTypes.array.isRequired
}

const searchInput = new ReactiveVar('')

export default createContainer(() => {
  Meteor.subscribe('notificationusers.search', searchInput.get())
  const users = NotificationUsers.find({}, {sort: {score: -1}}).fetch()
  return {
    users,
    searchInput
  }
}, SearchPage)
