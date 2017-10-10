/* global Roles */
import {Meteor} from 'meteor/meteor'

import {ApiKeys} from '../../models/apikey'
import {ROLES} from '../../models/user'

Meteor.publish('apikeys', function () {
  return Roles.userIsInRole(this.userId, [ROLES.admin])
    ? ApiKeys.find()
    : this.stop()
})
