#!/usr/bin/env bash
set -xeuo pipefail

#   per GregW
export BUILD_TYPE=static

#   stop serving the project first
#   this _should_ make the host fail health checks until restarted
npm run stop && wait

cd /opt/glitch-community
rm -rf node_modules

#   currently assuming we have a build file
tar -xz --overwrite -f build.tar.gz
rm build.tar.gz

#   install the deps, run the app
npm i

#   temporarily adding a pause here to test how the lb / asg react when deploys take a while
sleep 3.5m

npm run start
