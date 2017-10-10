/* global Roles */
import {Meteor} from 'meteor/meteor'

import {ROLES} from '../../models/user'

Meteor.publish('users.all', function () {
  return Roles.userIsInRole(this.userId, [ROLES.admin])
    ? Meteor.users.find()
    : this.stop()
})
