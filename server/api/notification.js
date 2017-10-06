/* global Roles */
import {Meteor} from 'meteor/meteor'

import * as Api from '.'
import {Notifications} from '../../models/notification.js'
import {ROLES} from '../../models/user'

Meteor.publish('notifications', function () {
  return Roles.userIsInRole(this.userId, [ROLES.member, ROLES.admin])
    ? Notifications.find()
    : this.stop()
})

Api.post('/api/notification', async (request) => {
  try {
    return {id: await Notifications.insert(request.body)}
  } catch (error) {
    Api.throwFormError(error)
  }
})
