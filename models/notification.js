import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const Notifications = new Mongo.Collection('notifications')

if (Meteor.isServer) {
  setTTL()
  setIndexes()
}

export function setTTL () {
  Notifications._ensureIndex({expireAt: 1}, {expireAfterSeconds: 0})
}

export function setIndexes () {
  Notifications._ensureIndex({id: 1})
  Notifications._ensureIndex({datetime: 1})
  Notifications._ensureIndex({userId: 1})
}

Notifications.eventSchema = new SimpleSchema({
  type: {
    type: String
  },
  datetime: {
    type: Date
  },
  info: {
    type: String, optional: true
  }
  // every other field is ignored
})

Notifications.schema = new SimpleSchema({
  id: {
    type: String, optional: true
  },
  userId: { // filled automatically
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
  tags: {
    type: Array, optional: true
  },
  'tags.$': {
    type: String
  },
  isFromUser: {
    type: Boolean, optional: true
  },
  events: {
    type: Array, optional: true
  },
  'events.$': {
    type: Notifications.eventSchema
  },
  expireAt: {
    type: Date, optional: true
  }
  // every other field is ignored
})

Notifications.attachSchema(Notifications.schema)
