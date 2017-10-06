import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'

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
