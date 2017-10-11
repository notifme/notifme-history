<p align="center">
  <img alt="Notif.me History" src="https://notifme.github.io/notifme-history/img/logo.png" />
</p>

<p align="center">
  A pretty history of the conversations with your users.
</p>

<p align="center">
  <a href="https://david-dm.org/notifme/notifme-history"><img alt="dependencies" src="https://david-dm.org/notifme/notifme-history.svg" /></a>
  <a href="https://david-dm.org/notifme/notifme-history?type=dev"><img alt="dev dependencies" src="https://david-dm.org/notifme/notifme-history/dev-status.svg" /></a>
  <a href="https://github.com/standard/standard"><img alt="js-standard-style" src="https://img.shields.io/badge/codestyle-Standard_JS-brightgreen.svg?style=flat" /></a>
  <a href="https://github.com/notifme/notifme-history/blob/master/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT_License-blue.svg?style=flat" /></a>
  <a href="https://slackin-notifme.now.sh"><img alt="license" src="https://img.shields.io/badge/Slack-Join_us!-e01563.svg?style=flat" /></a>
</p>

- [Features](#features)
- [Getting started](#getting-started)
- [How to use](#how-to-use)
  - [1. Model](#1-model)
  - [2. API](#2-api)
  - [3. Options](#3-options)
    - [POST /api/notification](#post-apinotification)
    - [POST /api/notification/event](#post-apinotificationevent)
- [Contributing](#contributing)
- [Need help? Found a bug?](#need-help-found-a-bug)

## Features

* **Pretty history** — Display all the conversations with your users, along with events associated with the notifications (no more "Did user X received the Y SMS?" from the client service team).

* **Configure data retention** — Decide until when each notification must be kept and set a capping on your MongoDB database.

* **Auto-refresh** — The displayed notifications are automatically refreshed when they change or when new ones are created (with the help of [Meteor](https://www.meteor.com/)).

* **Search by user info** — All user fields are indexed and you can make complex searches [with negations and phrases](https://docs.mongodb.com/manual/reference/operator/query/text/#search-field).

* **User management** — An administrator can easily give or revoke access to any user.

* **Simple API** — The model of the extra data (users, notification details) you send to the API is up to you.

* **MIT license** — Use it like you want.

<br>
<p align="center">
  <img alt="Preview" src="https://notifme.github.io/notifme-history/img/preview.gif" />
</p>

## Getting Started

```shell
$ docker run -d -p 80:3000 --name notifme-history notifme/history:dev-latest
```

:sparkles: Then open http://localhost in your favorite browser.

> You will need an OAuth client ID and secret from Google (the steps to create one will be detailed in the application).

> notifme/history:dev-* images are not suited for production use. They include MongoDB and if you delete the container all the data is lost.

## How to use

- [1. Model](#1-model)
- [2. API](#2-api)
- [3. Options](#3-options)
  - [POST /api/notification](#post-apinotification)
  - [POST /api/notification/event](#post-apinotificationevent)

### 1. Model

Data is distributed into 3 main tables: `Notifications`, `NotificationDetails`, and `NotificationUsers`.

| Table | Use |
| --- | --- |
| `Notifications` | This is the only table with an imposed model. Data corresponds with the notification list view and is intended to be a summary of the content (`datetime`, `channel`, `title`, `text`, `tags`...) to be kept longer than all the details.<br><br>You choose how long to keep each notification by setting an expiration date. |
| `NotificationDetails` | This is where you can store all the (possibly lengthy) details of your notifications. You can use the model you want.<br><br>The table can be capped to a given size in MB so you don't exceed your quota. |
| `NotificationUsers` | This table is used for the search feature. All field are indexes, so you should keep this data simple. The only required field is `id`.<br><br>You choose how long to keep each user by setting an expiration date, or it will expire when the last notification associated expires. |

### 2. API

#### POST /api/notification

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `id` | `false` | `String` | The external identifier of the notification. Required if you want to add events later on. |
| `channel` | `true` | `String` | Type of the notification, you can put any string you want (`email`, `sms`, `push`, `webpush`, `slack`...). |
| `datetime` | `true` | `Date` | Datetime ISO format. |
| `title` | `true` | `String` | Notification's title. |
| `text` | `false` | `String` | Notification's text content or summary. |
| `tags` | `false` | `String[]` | Visual tags associated with the notification. |
| `user` | `false` | `Object` | User information (for search feature). Only one field is required: `id`. The rest is up to you (but beware of the search index size, keep your data simple). |
| `details` | `false` | `Object` | Any detail you want to keep. |
| `events` | `false` | `Object[]` | Initial events. Fields: `type` (String, required), `datetime` (Date, required), `info` (String, optional). |
| `isFromUser` | `false` | `boolean` | If the message comes from a user. |
| `expireAt` | `false` | `Date` | Time until when to keep the notification (ISO format). |

##### Minimal example:

```shell
curl -X POST http://localhost:3000/api/notification/event \
  -H 'authorization: ...' \
  -H 'content-type: application/json' \
  -d '{ "title": "Minimal notification", "channel": "sms", "datetime": "2019-12-24 12:00:00" }'
```

##### Complete example:

```shell
curl -X POST http://localhost:3000/api/notification/event \
  -H 'authorization: ...' \
  -H 'content-type: application/json' \
  -d '{ "id": "notification-1", "title": "Complete notification", "channel": "email", "datetime": "2019-12-24 12:00:00", "text": "Hello!", "tags": [ "John Doe" ], "user": { "id": "user-1", "name": "John Doe", "email": "john@example.com", "phone": "+15000000000" }, "details": { "subject": "Test email!", "html": "<h1>Hello!</h1>" }, "events": [ { "type": "sent", "datetime": "2019-12-24 12:00:00" } ], "expireAt": "2024-12-24 12:00:00" }'
```

##### User answer example:

```shell
curl -X POST http://localhost:3000/api/notification/event \
-H 'authorization: ...' \
-H 'content-type: application/json' \
-d '{ "title": "Re: Minimal notification", "channel": "sms", "datetime": "2019-12-25 12:00:00", "isFromUser": true, "text": "this is my answer" }'
```

#### POST /api/notification/event

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `notificationId` | `true` | `String` | The external identifier of the notification. |
| `type` | `true` | `String` | Type of your event, you can put any string you want (`sent`, `delivered`, `errored`...). |
| `datetime` | `true` | `Date` | Datetime ISO format. |
| `info` | `false` | `String` | Any information you want to keep about this event. |

##### Example:

```shell
curl -X POST http://localhost:3000/api/notification/event \
  -H 'authorization: ...' \
  -H 'content-type: application/json' \
  -d '{ "notificationId": "notification-1", "type": "delivered", "datetime": "2019-12-24 12:00:00" }'
```

### 3. Options

| Name | Description |
| --- | --- |
| `NOTIFICATION_DETAILS_LIMIT_MB` | Optional. Capping in MB for the `NotificationDetails` table. Changing this value on a non-empty table is possible, but the operation will [require a global write lock](https://docs.mongodb.com/manual/core/capped-collections/#convert-a-collection-to-capped) and block all other operations until it has completed. |
| `GOOGLE_CONSUMER_KEY` | Required (but not necessarily at startup). OAuth client ID from Google.  |
| `GOOGLE_CONSUMER_SECRET` | Required (but not necessarily at startup). OAuth secret from Google. |

You can pass them when you run docker:

```shell
$ docker run -d -e NOTIFICATION_DETAILS_LIMIT_MB=256 ...
```

## Contributing

Contributions are very welcome!

To get started: [fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.

```shell
$ # Install meteor 1.6 (if not already installed)
$ curl https://install.meteor.com/ | sh
```

```shell
$ git clone git@github.com:[YOUR_USERNAME]/notifme-history.git && cd notifme-history
$ meteor npm install
$ npm run start
```

Before making a [pull request](https://help.github.com/articles/creating-a-pull-request/), check that the code respects the [Standard JS rules](https://standardjs.com/).

```shell
$ npm run lint
```

## Need Help? Found a bug?

[Submit an issue](https://github.com/notifme/notifme-history/issues) to the project Github if you need any help.
And, of course, feel free to submit pull requests with bug fixes or changes.
