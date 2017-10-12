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
      secret: process.env.GOOGLE_CONSUMER_SECRET,
      loginStyle: 'popup'
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
  const isDemo = process.env.ROOT_URL === 'http://notifme-history-demo.now.sh' // XXX
  user.roles = [userCount === 0 ? ROLES.admin : isDemo ? ROLES.member : ROLES.guest]
  if (user.roles[0] === ROLES.admin) {
    const token = crypto.randomBytes(16).toString('hex')
    ApiKeys.insert({
      token,
      scopes: [SCOPES.write],
      createdAt: new Date(),
      byUser: {id: user._id, name: user.profile.name}
    })
  } else {
    // TODO v2: notify admin(s)
  }
  Roles.setUserRoles(user._id, user.roles)
  return user
})
