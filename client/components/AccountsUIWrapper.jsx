import {Blaze} from 'meteor/blaze'
import {Template} from 'meteor/templating'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class AccountsUIWrapper extends Component {
  componentDidMount () {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template.loginButtons, ReactDOM.findDOMNode(this.refs.container))
  }

  componentWillUnmount () {
    // Clean up Blaze view
    Blaze.remove(this.view)
  }

  render () {
    return <span ref='container' />
  }
}
