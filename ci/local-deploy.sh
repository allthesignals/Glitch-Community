#!/usr/bin/env bash
set -euo pipefail

cd /opt/glitch-community
tar -xz --overwrite -f build.tar.gz
rm build.tar.gz

rm package-lock.json && npm i   #   this is a hack, and probably not a good one.
npm run stop && wait
npm run start &
pid=$!
wait ${pid}