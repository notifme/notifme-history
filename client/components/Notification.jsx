import PropTypes from 'prop-types'
import React, {Component} from 'react'

export default class Notification extends Component {
  render () {
    return (
      <li>{this.props.notification.title}</li>
    )
  }
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired
}
