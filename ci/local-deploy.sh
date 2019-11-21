#!/usr/bin/env bash
set -euo pipefail

#   assuming we have a build file
cd /opt/glitch-community
tar -xz --overwrite -f build.tar.gz
rm build.tar.gz

#   and install the deps. was running into missing files trying to be renamed
#   package-lock.json was _probably_ just out-of-date - might be able to stop doing it here
rm package-lock.json && npm i   #   this is a hack, and probably not a good one.

#   per GregW
BUILD_TYPE=static

npm run stop && wait
npm run start
