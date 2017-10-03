import * as Api from '.'
import {Notifications} from '../../models/notification.js'

Api.post('/api/notification', async (request) => {
  try {
    return {id: await Notifications.insert(request.body)}
  } catch (error) {
    Api.throwFormError(error)
  }
})
