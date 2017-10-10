/* global Roles */
import {check} from 'meteor/check'
import {Meteor} from 'meteor/meteor'

import {ROLES} from '../../models/user'

Meteor.publish('users.all', function () {
  return Roles.userIsInRole(this.userId, [ROLES.admin])
    ? Meteor.users.find()
    : this.stop()
})

Meteor.methods({
  'user.setRole' (userId, role) {
    check(userId, String)
    check(role, String)

    if (ROLES[role] && userId !== Meteor.userId() && Roles.userIsInRole(Meteor.userId(), [ROLES.admin])) {
      Roles.setUserRoles(userId, [role])
    } else {
      throw new Meteor.Error('not-authorized')
    }
  }
})
