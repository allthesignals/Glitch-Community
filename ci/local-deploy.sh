#!/usr/bin/env bash
set -euo pipefail

#   stop serving the project first
#   this _should_ make the host fail health checks until it's restarted
npm run stop && wait

cd /opt/glitch-community
rm -rf node_modules #   

#   we're currently assuming we have a build file
tar -xz --overwrite -f build.tar.gz
rm build.tar.gz

#   install the deps, set the build type, run.
npm i

#   per GregW
export BUILD_TYPE=static

npm run start
