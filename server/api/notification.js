/* global Roles */
import {Meteor} from 'meteor/meteor'

import * as Api from '.'
import {Notifications} from '../../models/notification.js'
import {NotificationDetails} from '../../models/notificationDetail.js'
import {NotificationUsers} from '../../models/notificationUser.js'
import {ROLES} from '../../models/user'

Meteor.publish('notifications', function () {
  return Roles.userIsInRole(this.userId, [ROLES.member, ROLES.admin])
    ? Notifications.find()
    : this.stop()
})

Api.post('/api/notification', async (request) => {
  try {
    const {user, details, ...notification} = request.body
    if (notification.datetime) notification.datetime = new Date(notification.datetime)
    if (notification.expireAt) notification.expireAt = new Date(notification.expireAt)

    if (user) NotificationUsers.schema.validate(user, {ignore: ['keyNotInSchema']})
    if (details) NotificationDetails.schema.validate(details, {ignore: ['keyNotInSchema']})
    Notifications.schema.validate(notification, {ignore: ['keyNotInSchema']})

    if (user) {
      await NotificationUsers.update({id: user.id}, user, {upsert: true})
      notification.userId = user.id
    }
    const notificationId = await Notifications.insert(notification)
    if (details) {
      if (notification.id) details.id = notification.id
      details.notificationId = notificationId
      await NotificationDetails.insert(details)
    }
    return {id: notificationId}
  } catch (error) {
    Api.throwFormError(error)
  }
})
