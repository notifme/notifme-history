import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const Notifications = new Mongo.Collection('notifications')

if (Meteor.isServer) {
  setIndexes()
  setTTL()
}

export function setIndexes () {
  Notifications._ensureIndex({'id': 1})
  Notifications._ensureIndex({'datetime': 1})
}

export function setTTL () {
  Notifications._ensureIndex({expireAt: 1}, {expireAfterSeconds: 0})
}

Notifications.schema = new SimpleSchema({
  id: {
    type: String, optional: true
  },
  channel: {
    type: String
  },
  datetime: {
    type: Date
  },
  title: {
    type: String
  },
  text: {
    type: String, optional: true
  },
  info: {
    type: Array, optional: true
  },
  'info.$': {
    type: String
  }
})

Notifications.attachSchema(Notifications.schema)
