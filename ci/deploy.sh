#!/usr/bin/env bash
set -euo pipefail
set -x

#####
# THIS SCRIPT RUNS ON THE CIRCLE CI EXECUTOR
# It marshalls remote calls to devices inside our infrastructure where some of the work occurs
#####

# check req params - we need a sha to use for file manipulation later
if [ -z "$1" ]; then
  >&2 echo "Usage:"
  >&2 echo "./$(basename $0) sha"
  exit 1
fi

export CIRCLE_SHA=$1
source ci/env

./ci/publish-build-asset.sh "${ENVIRONMENT}" "${CIRCLE_SHA}" "${COMMUNITY_AWS_BOOTSTRAP_SECRET}"

# first get the list of hostnames - we could do this on any host, but we know the worker has the code
HOSTNAMES=( $(ssh -q "${JUMP_DOMAIN}" "bash -c '/opt/glitch/ci/hostnames-by-role community ${ENVIRONMENT}'") )

echo "${HOSTNAMES[@]}"

for name in ${HOSTNAMES[*]}
do

  echo "${name}"

  # try to avoid potential bootstrap problems with updates to the local deploy by uploading it 
  # (and the corresponding env file) to /tmp and executing from there.
  scp /home/circleci/project/ci/local-deploy.sh "deploy@${name}.$ENVIRONMENT":/tmp; code=$?
  scp /home/circleci/project/ci/env "deploy@${name}.$ENVIRONMENT":/tmp; code=$?


  # do the "local" deploy stuff
  ssh -o StrictHostKeyChecking=no "$name.${ENVIRONMENT}" "bash --login -c \"cd /tmp && ./local-deploy.sh ${ENVIRONMENT} ${CIRCLE_SHA} ${COMMUNITY_AWS_BOOTSTRAP_SECRET}\""; code=$?

done

if [ ${code} -ne 0 ]; then
  echo "Deploy failed"
  exit ${code}
fi

echo "Deploy succeeded"
