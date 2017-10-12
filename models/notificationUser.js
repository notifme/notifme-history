import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const NotificationUsers = new Mongo.Collection('notificationusers')

if (Meteor.isServer) {
  setTTL()
  setIndexes()
}

export function setTTL () {
  NotificationUsers._ensureIndex({expireAt: 1}, {expireAfterSeconds: 0})
}

export function setIndexes () {
  NotificationUsers._ensureIndex({id: 1})
  NotificationUsers._ensureIndex({'$**': 'text'})
}

NotificationUsers.schema = new SimpleSchema({
  id: {
    type: String
  },
  expireAt: {
    type: Date, optional: true
  },
  createdAt: {
    type: Date
  }
  // every other field is accepted
})
