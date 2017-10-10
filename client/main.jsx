/* global Router */
import {Meteor} from 'meteor/meteor'
import React from 'react'
import {hydrate} from 'react-dom'

import App from './App'

Meteor.startup(() => {
  hydrate(<App />, document.getElementById('content'))
})

/* iron:router is used on server-side for the API */
Router.configure({
  noRoutesTemplate: 'EmptyTemplate'
})
