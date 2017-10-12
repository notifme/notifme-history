#!/bin/bash

# Build dev
docker build \
  --build-arg INSTALL_MONGO=true \
  --build-arg NODE_VERSION=8.6.0 \
  -f Dockerfile-dev \
  -t notifme/history:dev-$npm_package_version \
  .

# Deploy dev
docker tag notifme/history:dev-$npm_package_version notifme/history:dev-latest
docker push notifme/history:dev-$npm_package_version
docker push notifme/history:dev-latest

# Build prod
docker build \
  -f Dockerfile-prod \
  -t notifme/history:$npm_package_version \
  .

# Deploy prod
docker tag notifme/history:$npm_package_version notifme/history:latest
docker push notifme/history:$npm_package_version
docker push notifme/history:latest
