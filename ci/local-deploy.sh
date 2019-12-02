#!/usr/bin/env bash
set -xeuo pipefail

#   per GregW
export BUILD_TYPE=static

#   stop serving the project first
#   this _should_ make the host fail health checks until restarted
npm run stop && wait

cd /opt/glitch-community
#   avoid cruft like deleted files from hanging around.
#   this will show errors for current and parent dirs 
#   but we want to see errors for anything else so not suppressing them
rm -rf * .*

#   currently assuming we have a build file
tar -xz --overwrite -f build.tar.gz
rm build.tar.gz

 # set up our env now that we clear the entire project directory
echo "PORT=9001" > .env
echo "NODE_ENV=staging" >> .env
echo "RUNNING_ON=staging" >> .env

#   install the deps, run the app
npm i

#   temporarily adding a pause here to test how the lb / asg react when deploys take a while
sleep $(($(date +%s) % 500))s

npm run start
