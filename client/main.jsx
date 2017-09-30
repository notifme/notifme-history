import {Meteor} from 'meteor/meteor'
import React from 'react'
import {render} from 'react-dom'

import App from './components/App.jsx'

Meteor.startup(() => {
  render(<App />, document.getElementById('content'))
})
