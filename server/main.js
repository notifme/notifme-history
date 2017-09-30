import {Meteor} from 'meteor/meteor'

import * as Notifications from '../models/notification.js'

Meteor.startup(() => {
  Notifications.setTTL()
})
