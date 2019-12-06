#!/usr/bin/env bash
set -xeuo pipefail

# check req params - we need a sha to use for file manipulation
if [ -z "$1" ]; then
  >&2 echo "Usage:"
  >&2 echo "./$(basename $0) sha"
  exit 1
fi

export CIRCLE_SHA=$1

# TODO
#   * does bootstrap need to be cleaned up to make it more idempotent / reliable?
#       if so then we might be able to store the current artifact in s3, 
#       but would need to do that from one of the hosts and not from ci 
#       to avoid needing secrets (we can use the ones from the Glitch repo)
#   * prevent overlapping deploys?
#       I think circleci might do this well enough for us, but should test quickly
#   * do we need a no-deploy flag?
#   * what's the appropriate user for these scripts to run as?
#   * connect env and branch to remove hard-coded vals
#   * add sha check script to the process

# first get the list of hostnames
HOSTNAMES=( $(ssh -q worker.staging "bash --login -c 'cd /opt/glitch && ci/hostnames-by-role community staging'") )

echo "${HOSTNAMES[@]}"

for name in ${HOSTNAMES[*]}
do

  echo $name

  #check if the asset is already in S3
  ASSET_SOURCE=$(ssh -o 'ProxyJump jump.staging.glitch.com' -o StrictHostKeyChecking=no "$name.staging" "bash --login -c \"cd /opt/glitch-community && ci/check-deploy-source.sh $CIRCLE_SHA\"")

  echo "$ASSET_SOURCE"

  # hard-coded push deploy
  scp -o 'ProxyJump jump.staging.glitch.com' -o StrictHostKeyChecking=no /home/circleci/$CIRCLE_SHA.tar.gz deploy@"$name".staging:/opt/glitch-community; code=$?

  # do the local deploy stuff
  ssh -o 'ProxyJump jump.staging.glitch.com' -o StrictHostKeyChecking=no "$name.staging" "bash --login -c \"cd /opt/glitch-community && ci/local-deploy.sh $CIRCLE_SHA\""; code=$?
done

if [ $code -ne 0 ]; then
  echo "Deploy failed"
  exit $code
fi

echo "Deploy succeeded"
