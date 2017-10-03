/* global SimpleSchema */
import {Mongo} from 'meteor/mongo'

export const Notifications = new Mongo.Collection('notifications')

export function setIndexes () {
  Notifications._ensureIndex({'id': 1})
  Notifications._ensureIndex({'datetime': 1})
}

export function setTTL () {
  Notifications._ensureIndex({expireAt: 1}, {expireAfterSeconds: 0})
}

Notifications.schema = new SimpleSchema({
  id: {
    type: String
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
  }
})

Notifications.attachSchema(Notifications.schema)
