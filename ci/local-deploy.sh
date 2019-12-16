#!/usr/bin/env bash
set -xeuo pipefail

#####
# THIS SCRIPT RUNS ON ALL COMMUNITY WORKERS
# It manages the running site, gets the requested asset, and deploys and installs it. 
# This script suffers from a bootstrap problem - if you change this script 
# a simple deploy will probably not suffice and may require some special management
#####

# check req params - we need the env and a sha to use for file manipulation
# fewer than 3 params is an error
if [ 3 -ne "$#" ]; then
  >&2 echo "Usage:"
  >&2 echo "./$(basename $0) environment sha bootstrap_bucket_secret"
  exit 1
fi

export ENVIRONMENT="$1"
export CIRCLE_SHA="$2"
export COMMUNITY_AWS_BOOTSTRAP_SECRET="$3"

cd /opt/glitch-community

source ./ci/env
export AWS_ACCESS_KEY_ID=${AWS_BOOTSTRAP_KEY}
export AWS_SECRET_ACCESS_KEY=${AWS_BOOTSTRAP_SECRET}

# we run npm i here to ensure pm2 is available and the npm script doesn't throw
npm i && npm run stop && wait

# prevent cruft like deleted files from hanging around; currently removed folders will still persist
# do NOT remove the asset or the ci scripts.
find . -type f | grep -v -e "${CIRCLE_SHA}.tar.gz" -e "ci" | xargs rm -rf

# go get the build file. we assume it is there; the only caller checks first. then deploy
aws s3 cp --quiet "s3://${BOOTSTRAP_BUCKET}/${CIRCLE_SHA}.tar.gz" .
tar -xz --overwrite -f "${CIRCLE_SHA}.tar.gz"
rm "${CIRCLE_SHA}.tar.gz"

#   retrieve the stored .env file
aws s3 cp --quiet s3://${BOOTSTRAP_BUCKET}/.env .
source .env

#   install the deps, run the app
npm i && wait

#   one can temporarily add a pseudo-random pause here
#   sleep $(($(date +%s) % 500))s

npm run start
