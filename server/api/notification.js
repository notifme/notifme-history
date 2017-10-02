import * as Api from '.'
import {Notifications} from '../../models/notification.js'

Api.post('/api/notification', async (request) => {
  return {id: await Notifications.insert(request.body)}
})
