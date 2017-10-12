#!/bin/bash

docker tag notifme/history:$npm_package_version notifme/history:latest
docker push notifme/history:$npm_package_version
docker push notifme/history:latest
