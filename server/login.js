/* global ServiceConfiguration, Accounts */
import {Meteor} from 'meteor/meteor'

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
    const userCount = Meteor.users.find().count()
    user.email = user.services.google.email
    user.isAdmin = userCount === 0
    user.profile = {
      name: user.services.google.name,
      picture: user.services.google.picture
    }
    return user
  })
}
