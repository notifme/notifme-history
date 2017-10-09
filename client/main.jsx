/* global Router */
import {Meteor} from 'meteor/meteor'
import React from 'react'
import {render} from 'react-dom'

import App from './App'

Meteor.startup(() => {
  render(<App />, document.getElementById('content'))
})

/* iron:router is used on server-side for the API */
Router.configure({
  noRoutesTemplate: 'EmptyTemplate'
})
