/* global ServiceConfiguration, Accounts, Roles */
import crypto from 'crypto'
import {Meteor} from 'meteor/meteor'

import {ROLES} from '../models/user'
import {ApiKeys, SCOPES} from '../models/apikey'

if (process.env.GOOGLE_CONSUMER_KEY && process.env.GOOGLE_CONSUMER_SECRET) {
  ServiceConfiguration.configurations.upsert({
    service: 'google'
  }, {
    $set: {
      clientId: process.env.GOOGLE_CONSUMER_KEY,
      secret: process.env.GOOGLE_CONSUMER_SECRET
    }
  })
}

Accounts.onCreateUser((options, user) => {
  user.email = user.services.google.email
  user.profile = {
    name: user.services.google.name,
    picture: user.services.google.picture
  }
  const userCount = Meteor.users.find().count()
  user.roles = [userCount === 0 ? ROLES.admin : ROLES.guest]
  if (user.roles[0] === ROLES.admin) {
    const token = crypto.randomBytes(16).toString('hex')
    ApiKeys.insert({token, scopes: [SCOPES.write], createdAt: new Date(), byUser: user._id})
  }
  Roles.addUsersToRoles(user._id, user.roles, Roles.GLOBAL_GROUP)
  return user
})
