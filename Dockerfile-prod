FROM notifme/history:dev-latest as builder

FROM node:8.6.0-slim
WORKDIR /app
COPY --from=builder /opt/meteor/dist/bundle .
EXPOSE 3000
CMD METEOR_MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL PORT=3000 NOTIFICATION_DETAILS_LIMIT_MB=$NOTIFICATION_DETAILS_LIMIT_MB node main.js
