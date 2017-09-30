import {Mongo} from 'meteor/mongo'

export const Notifications = new Mongo.Collection('notifications')

export function setTTL () {
  Notifications._ensureIndex({expireAt: 1}, {expireAfterSeconds: 0})
}
