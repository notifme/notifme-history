import {Meteor} from 'meteor/meteor'

import * as ApiKeys from '../models/apikey'
import * as Notifications from '../models/notification.js'
import * as Login from './login.js'

Meteor.startup(() => {
  ApiKeys.setTTL()
  ApiKeys.setIndexes()
  Notifications.setTTL()
  Notifications.setIndexes()
  Login.configure()
})
