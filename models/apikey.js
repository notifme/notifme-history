import {Mongo} from 'meteor/mongo'

export const SCOPES = {
  read: 'read',
  write: 'write'
}

export const ApiKeys = new Mongo.Collection('apikeys')

export function setTTL () {
  ApiKeys._ensureIndex({expireAt: 1}, {expireAfterSeconds: 0})
}
