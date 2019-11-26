#!/usr/bin/env bash
set -euo pipefail

#   assuming we have a build file
cd /opt/glitch-community

tar -xz --overwrite -f build.tar.gz
ls -la
rm build.tar.gz

npm i

#   per GregW
export BUILD_TYPE=static

npm run stop && wait
npm run start
