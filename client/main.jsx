/* global Router */
import {Meteor} from 'meteor/meteor'
import React from 'react'
import {render} from 'react-dom'

import App from './App.jsx'

Meteor.startup(() => {
  render(<App />, document.getElementById('content'))
})

/* iron:router is used on server-side for the API, but requires client routes */
;['/'].forEach((route) => Router.route(route, function () { this.render('EmptyTemplate') }))
