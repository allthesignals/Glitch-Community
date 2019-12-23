#!/usr/bin/env bash
set -euo pipefail
set -x

#####
# THIS SCRIPT RUNS ON the Circle CI executor
# It checks for the requested asset (based on the commit sha) in S3 
# and if not present uploads the asset
#####

# check req params - we need the env, a sha, and a secret for file manipulation
# fewer than 3 params is an error
if [ 3 -ne "$#" ]; then
  >&2 echo "Usage:"
  >&2 echo "./$(basename $0) environment sha bootstrap_bucket_secret"
  exit 1
fi

export ENVIRONMENT=$1
export CIRCLE_SHA=$2
export COMMUNITY_AWS_BOOTSTRAP_SECRET="$3"

source ./ci/env
export AWS_ACCESS_KEY_ID=${COMMUNITY_AWS_BOOTSTRAP_KEY}
export AWS_SECRET_ACCESS_KEY=${COMMUNITY_AWS_BOOTSTRAP_SECRET}

#   check to see if we have the package
if [[ -f "/home/circleci/$CIRCLE_SHA.tar.gz" ]]; then

  # maybe upload
  if aws s3api head-object --bucket "$COMMUNITY_BOOTSTRAP_BUCKET" --key "$CIRCLE_SHA.tar.gz" > /dev/null 2>&1; then
    code=$?
    echo "$CIRCLE_SHA.tar.gz exists in S3"
  else
    #   this build is not in s3
    aws s3 cp --quiet "/home/circleci/$CIRCLE_SHA.tar.gz" "s3://$COMMUNITY_BOOTSTRAP_BUCKET"; code=$?
  fi

  #update
  if [[ "$code" -eq 0 ]]; then
    echo "$CIRCLE_SHA" > /home/circleci/LAST_DEPLOYED_SHA
    aws s3 cp --quiet /home/circleci/LAST_DEPLOYED_SHA "s3://$COMMUNITY_BOOTSTRAP_BUCKET"; code=$?
  else
    echo "Failed to upload $CIRCLE_SHA.tar.gz to S3"
    exit "$code"
  fi

  if [[ "$code" -ne 0 ]]; then
    echo "Failed to update LAST_DEPLOYED_SHA"
  fi

else

  >&2 echo "No package $CIRCLE_SHA.tar.gz to deliver."
  exit 1

fi

# 0 means we published the asset successfully; anything else means not.
exit $code
