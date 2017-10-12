#!/bin/bash

docker build \
  -f Dockerfile-prod \
  -t notifme/history:$npm_package_version \
  .
