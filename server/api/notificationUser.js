/* global Roles */
import {Meteor} from 'meteor/meteor'

import {NotificationUsers} from '../../models/notificationUser'
import {ROLES} from '../../models/user'

Meteor.publish('notificationusers.get', function (userId) {
  return Roles.userIsInRole(this.userId, [ROLES.member, ROLES.admin])
    ? NotificationUsers.find({id: userId})
    : this.stop()
})

Meteor.publish('notificationusers.search', function (searchInput) {
  return Roles.userIsInRole(this.userId, [ROLES.member, ROLES.admin])
    ? NotificationUsers.find({
      $text: {$search: searchInput}
    }, {
      fields: {score: {$meta: 'textScore'}},
      sort: {score: {$meta: 'textScore'}},
      limit: 10
    })
    : this.stop()
})
