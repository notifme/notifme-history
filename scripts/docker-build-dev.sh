#!/bin/bash

docker build \
  --build-arg INSTALL_MONGO=true \
  --build-arg NODE_VERSION=8.6.0 \
  -f Dockerfile-dev \
  -t notifme/history:dev-$npm_package_version \
  .
