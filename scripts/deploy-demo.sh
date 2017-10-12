#!/bin/bash

now notifme/notifme-history --public \
  --alias notifme-history-demo -f \
  --env ROOT_URL=https://notifme-history-demo.now.sh/ \
  --env MONGO_URL=@notifme-history-mongo-url \
  --env NOTIFICATION_DETAILS_LIMIT_MB=24

URL="$(now ls notifme-history | grep now.sh | head -1 | awk '/now\.sh/ { print $1 }')"

now scale notifme-history-demo.now.sh 0
now alias $URL notifme-history-demo
now rm --safe --yes notifme-history
now scale notifme-history-demo.now.sh 1
