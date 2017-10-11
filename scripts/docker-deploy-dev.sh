#!/bin/bash

docker tag notifme/history:dev-$npm_package_version notifme/history:dev-latest
docker push notifme/history:dev-$npm_package_version
docker push notifme/history:dev-latest
