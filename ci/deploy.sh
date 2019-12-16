#!/usr/bin/env bash
set -eo pipefail
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
set -u  # -u not set above because we expect ENVIRONMENT to be unset when ci/env is called from CircleCI

./ci/publish-build-asset.sh "${ENVIRONMENT}" "${CIRCLE_SHA}" 

# first get the list of hostnames - we could do this on any host, but we know the worker has the code
HOSTNAMES=( $(ssh -q "worker.${ENVIRONMENT}" "bash --login -c 'cd /opt/glitch && ci/hostnames-by-role community ${ENVIRONMENT}'") )

echo "${HOSTNAMES[@]}"

for name in ${HOSTNAMES[*]}
do

  echo "${name}"

  # do the "local" deploy stuff
  ssh -o "ProxyJump $JUMP_DOMAIN" -o StrictHostKeyChecking=no "$name.${ENVIRONMENT}" "bash --login -c \"cd /opt/glitch-community && ci/local-deploy.sh ${ENVIRONMENT} ${CIRCLE_SHA} ${COMMUNITY_AWS_BOOTSTRAP_SECRET}\""; code=$?

done

if [ ${code} -ne 0 ]; then
  echo "Deploy failed"
  exit ${code}
fi

echo "Deploy succeeded"
