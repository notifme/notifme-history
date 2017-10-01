import {Meteor} from 'meteor/meteor'

import * as Notifications from '../models/notification.js'
import * as Login from './login.js'

Meteor.startup(() => {
  Notifications.setTTL()
  Login.configure()
})
