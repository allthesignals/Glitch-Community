#!/usr/bin/env bash
set -xeuo pipefail

#####
# THIS SCRIPT RUNS ON ALL COMMUNITY WORKERS
# It manages the running site, gets the requested asset, and deploys and installs it. 
# This script suffers from a bootstrap problem - if you change this script 
# a simple deploy will probably not suffice and may require some special management
#####

#   TODO
#   *   parameterize the bootstrap bucket and other env vars

# check req params - we need the env and a sha to use for file manipulation
if [ 2 -ne "$#" ]; then
  >&2 echo "Usage:"
  >&2 echo "./$(basename $0) environment sha"
  exit 1
fi

export ENVIRONMENT=$1
export CIRCLE_SHA=$2

cd /opt/glitch-community

source ci/env

# we run npm i here in case pm2 is not available but we could probably just swallow that error
npm i && npm run stop && wait

# avoid cruft like deleted files from hanging around; currently removed folders will still persist
# do NOT remove the asset or the ci scripts.
find . -type f | grep -v -e "$CIRCLE_SHA.tar.gz" -e "ci" | xargs rm -rf

# go get the build file. we assume it is there; the only caller checks first. then deploy
aws s3 cp --quiet "s3://$BOOTSTRAP_BUCKET/$CIRCLE_SHA.tar.gz" .
tar -xz --overwrite -f "$CIRCLE_SHA.tar.gz"
rm "$CIRCLE_SHA.tar.gz"

#   retrieve the stored .env file
aws s3 cp --quiet s3://community-bootstrap-bucket20191205165831056600000001/.env .
source .env

#   install the deps, run the app
npm i && wait

#   one can temporarily add a pseudo-random pause here
#   sleep $(($(date +%s) % 500))s

npm run start
