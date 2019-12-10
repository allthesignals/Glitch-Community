#!/usr/bin/env bash
set -xeuo pipefail

#####
# THIS SCRIPT RUNS ON THE CIRCLE CI EXECUTOR
# It marshalls remote calls to devices inside our infrastructure where the work occurs
#####

# check req params - we need a sha to use for file manipulation later
if [ -z "$1" ]; then
  >&2 echo "Usage:"
  >&2 echo "./$(basename $0) sha"
  exit 1
fi

export CIRCLE_SHA=$1

# TODO
# * connect env and branch to remove hard-coded vals
# * should this connect to Honeycomb? I think it would be valuable.

# first get the list of hostnames - we could do this on any host, but we know the worker has the code
HOSTNAMES=( $(ssh -q worker.staging "bash --login -c 'cd /opt/glitch && ci/hostnames-by-role community staging'") )

echo "${HOSTNAMES[@]}"

for name in ${HOSTNAMES[*]}
do

  # if we run into a problem with the sequence of remote call we fall back to 
  # shoving the asset to the destination server and brute forcing the deploy
  # this is super-naive, and we mightr want to handle errors more explicitly
  catch() {
    echo "something bad happened; let us see if just pushing the asset will work"

    # hard-coded push deploy
    scp -o 'ProxyJump jump.staging.glitch.com' -o StrictHostKeyChecking=no /home/circleci/$2.tar.gz deploy@"$1".staging:/opt/glitch-community; code=$?

    # do the local deploy stuff
    ssh -o 'ProxyJump jump.staging.glitch.com' -o StrictHostKeyChecking=no "$1.staging" "bash --login -c \"cd /opt/glitch-community && ci/local-deploy.sh $2\""; code=$?

  }

  echo $name

  #check if the asset is already in S3
  ssh -o 'ProxyJump jump.staging.glitch.com' -o StrictHostKeyChecking=no "$name.staging" "bash --login -c \"cd /opt/glitch-community && ci/check-deploy-source.sh $CIRCLE_SHA\""; code=$?
  S3_LOOKUP_RESULT="$code"

  # we trap here because we expect the previous to return failure sometimes
  trap 'catch $name $CIRCLE_SHA' ERR

  echo "$S3_LOOKUP_RESULT"
  if [[ "$S3_LOOKUP_RESULT" ]]; then
    # we have the package, so upload it to a device and then to s3
    scp -o 'ProxyJump jump.staging.glitch.com' -o StrictHostKeyChecking=no /home/circleci/$CIRCLE_SHA.tar.gz deploy@"$name".staging:/opt/glitch-community; code=$?

    ssh -o 'ProxyJump jump.staging.glitch.com' -o StrictHostKeyChecking=no "$name.staging" "bash --login -c \"cd /opt/glitch-community && ci/upload-asset.sh $CIRCLE_SHA\""; code=$?
  fi

  # do the "local" deploy stuff
  ssh -o 'ProxyJump jump.staging.glitch.com' -o StrictHostKeyChecking=no "$name.staging" "bash --login -c \"cd /opt/glitch-community && ci/local-deploy.sh $CIRCLE_SHA\""; code=$?

done

if [ $code -ne 0 ]; then
  echo "Deploy failed"
  exit $code
fi

echo "Deploy succeeded"
