import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const NotificationUsers = new Mongo.Collection('notificationusers')

if (Meteor.isServer) {
  setIndexes()
}

export function setIndexes () {
  NotificationUsers._ensureIndex({id: 1})
  NotificationUsers._ensureIndex({'$**': 'text'})
}

NotificationUsers.schema = new SimpleSchema({
  id: {
    type: String
  }
  // every other field is accepted
})
