#!/usr/bin/env bash
set -euo pipefail

cd /opt/glitch-community
tar -xz --overwrite -f build.tar.gz
rm build.tar.gz

npm i
npm run stop && wait
npm run start &