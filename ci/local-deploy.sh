#!/usr/bin/env bash
set -xeuo pipefail

#####
#   THIS SCRIPT RUNS ON ALL COMMUNITY WORKERS
#####

#   TODO
#   *   parameterize the bootstrap bucket

# check req params - we need a sha to use for file manipulation
if [ -z "$1" ]; then
  >&2 echo "Usage:"
  >&2 echo "./$(basename $0) sha"
  exit 1
fi

export CIRCLE_SHA=$1

cd /opt/glitch-community

#   stop serving the project first
#   this should make the host fail health checks until restarted
#   I'm running npm i here in case pm2 is not available
#   but this results in double installs sometimes
#   the thing, though, is that if pm2 is not available do we even need to stop the site?
#   if pm2 is not there the site probably is not running, could we instead just swallow the error?

npm i && npm run stop && wait

#   avoid cruft like deleted files from hanging around; currently removed folders will still persist
#   this should avoid error messages and exit codes for current and parent dirs
find . -type f | grep -v -e "$CIRCLE_SHA.tar.gz" -e "ci" | xargs rm -rf

#   currently assuming we have a build file
# nope, assume we do not have a build file and go get it
aws s3 cp --quiet "s3://community-bootstrap-bucket20191205165831056600000001/$CIRCLE_SHA.tar.gz" .

tar -xz --overwrite -f "$CIRCLE_SHA.tar.gz"
rm "$CIRCLE_SHA.tar.gz"

#   retrieve the stored .env file
aws s3 cp --quiet s3://community-bootstrap-bucket20191205165831056600000001/.env .

#   install the deps, run the app
npm i && wait

#   one can temporarily add a pause here to test how the lb and asg react when deploys take a while
#   sleep $(($(date +%s) % 500))s

npm run start
