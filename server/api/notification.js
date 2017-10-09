/* global Roles */
import {Meteor} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'

import * as Api from '.'
import {Notifications} from '../../models/notification'
import {NotificationDetails} from '../../models/notificationDetail'
import {NotificationUsers} from '../../models/notificationUser'
import {ROLES} from '../../models/user'

Meteor.publish('notifications', function () {
  return Roles.userIsInRole(this.userId, [ROLES.member, ROLES.admin])
    ? Notifications.find()
    : this.stop()
})

Meteor.publish('notifications.getWithDetail', function (searchBy, id) {
  if (Roles.userIsInRole(this.userId, [ROLES.member, ROLES.admin])) {
    const notification = Notifications.findOne({[searchBy === 'id' ? 'id' : '_id']: id}, {sort: {datetime: -1}})
    if (notification) {
      return [
        Notifications.find(notification._id),
        NotificationUsers.find({id: notification.userId}),
        NotificationDetails.find({notificationId: notification._id})
      ]
    }
  }
  return this.stop()
})

Meteor.publish('notifications.findByUser', function (userId) {
  return Roles.userIsInRole(this.userId, [ROLES.member, ROLES.admin])
    ? Notifications.find({userId}, {sort: {datetime: -1}})
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

Api.post('/api/notification/event', async (request) => {
  try {
    const {notificationId, ...event} = request.body
    if (event.datetime) event.datetime = new Date(event.datetime)

    new SimpleSchema({notificationId: String}).validate({notificationId}, {ignore: ['keyNotInSchema']})
    Notifications.eventSchema.validate(event, {ignore: ['keyNotInSchema']})

    await Notifications.update({id: notificationId}, {$push: {events: event}})
    return true
  } catch (error) {
    Api.throwFormError(error)
  }
})
