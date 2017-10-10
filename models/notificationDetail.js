import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

export const NotificationDetails = new Mongo.Collection('notificationdetails')

if (Meteor.isServer) {
  setCapping()
  setIndexes()
}

export function setCapping () {
  const cappingMB = process.env.NOTIFICATION_DETAILS_LIMIT_MB
  if (cappingMB) {
    const cappingInBytes = cappingMB * 10e6
    NotificationDetails._createCappedCollection(cappingInBytes)

    const updateCapping = () => {
      NotificationDetails.rawDatabase().command({
        convertToCapped: 'notificationdetails',
        size: cappingInBytes
      })
    }

    NotificationDetails.rawCollection().isCapped()
      .then((isCapped) => {
        if (isCapped) {
          NotificationDetails.rawCollection().stats().then(({maxSize}) => {
            if (Math.abs(maxSize - cappingInBytes) >= 256) updateCapping()
          })
        } else {
          updateCapping()
        }
      })
      .catch(console.log)
  }
}

export function setIndexes () {
  NotificationDetails._ensureIndex({id: 1})
  NotificationDetails._ensureIndex({notificationId: 1})
}

NotificationDetails.schema = new SimpleSchema({
  id: { // filled automatically
    type: String, optional: true
  },
  notificationId: { // filled automatically
    type: String, optional: true
  }
  // every other field is accepted
})
