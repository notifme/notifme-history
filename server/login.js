/* global ServiceConfiguration, Accounts, Roles */
import {Meteor} from 'meteor/meteor'

import {ROLES} from '../models/user'

export function configure () {
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
    Roles.addUsersToRoles(user._id, user.roles, Roles.GLOBAL_GROUP)
    return user
  })
}
