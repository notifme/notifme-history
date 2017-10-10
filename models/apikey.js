import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const SCOPES = {
  read: 'read',
  write: 'write'
}

export const ApiKeys = new Mongo.Collection('apikeys')

if (Meteor.isServer) {
  setIndexes()
  setTTL()
}

export function setIndexes () {
  ApiKeys._ensureIndex({token: 1})
}

export function setTTL () {
  ApiKeys._ensureIndex({expireAt: 1}, {expireAfterSeconds: 0})
}

ApiKeys.byUserSchema = new SimpleSchema({
  id: {
    type: String
  },
  name: {
    type: String
  }
})

ApiKeys.schema = new SimpleSchema({
  token: {
    type: String
  },
  createdAt: {
    type: Date
  },
  byUser: {
    type: ApiKeys.byUserSchema
  },
  scopes: {
    type: Array
  },
  'scopes.$': {
    type: String, allowedValues: Object.values(SCOPES)
  },
  expireAt: {
    type: Date, optional: true
  }
  // every other field is ignored
})

ApiKeys.attachSchema(ApiKeys.schema)
