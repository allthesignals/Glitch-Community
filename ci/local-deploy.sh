#!/usr/bin/env bash
set -xeuo pipefail

#   stop serving the project first
#   this should make the host fail health checks until restarted
npm run stop && wait

cd /opt/glitch-community
#   avoid cruft like deleted files from hanging around
#   this should avoid error messages and exit codes for current and parent dirs
rm -rf .[^.] .??*

#   currently assuming we have a build file
tar -xz --overwrite -f build.tar.gz
rm build.tar.gz

#   retrieve the stored .env file
aws s3 cp --quiet s3://community-bootstrap-bucket20191205165831056600000001/.env .

#   install the deps, run the app
npm i && wait

#   one can temporarily add a pause here to test how the lb and asg react when deploys take a while
#   sleep $(($(date +%s) % 500))s

npm run start
