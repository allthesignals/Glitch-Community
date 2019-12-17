#!/usr/bin/env bash
set -x  #   we don't want -e or -o pipefail; we want to handle the results of the grep at the end

#####
# THIS SCRIPT RUNS ON the Circle CI executor
# It checks for the requested asset (based on the commit sha) in S3 
# and if not present uploads the asset
#####

# check req params - we need the env and a sha to use for file manipulation
# fewer than 2 params is an error
if [ 2 -ne "$#" ]; then
  >&2 echo "Usage:"
  >&2 echo "./$(basename $0) environment sha"
  exit 1
fi

export ENVIRONMENT=$1
export CIRCLE_SHA=$2

source ./ci/env
export AWS_ACCESS_KEY_ID=${AWS_BOOTSTRAP_KEY}
export AWS_SECRET_ACCESS_KEY=${AWS_BOOTSTRAP_SECRET}

# check S3 for the asset; tell caller the result
aws s3api head-object --bucket "$COMMUNITY_BOOTSTRAP_BUCKET" --key "$CIRCLE_SHA.tar.gz" > /dev/null 2>&1; code=$?

#   check to see if we have the package
if [[ -f "/home/circleci/$CIRCLE_SHA.tar.gz" ]]; then

  if [[ "$code" -ne 0 ]]; then
    #   no file in s3
    aws s3 cp --quiet "/home/circleci/$CIRCLE_SHA.tar.gz" "s3://$COMMUNITY_BOOTSTRAP_BUCKET"
    echo "$CIRCLE_SHA" > /home/circleci/LAST_DEPLOYED_SHA
    aws s3 cp --quiet /home/circleci/LAST_DEPLOYED_SHA "s3://$COMMUNITY_BOOTSTRAP_BUCKET"
  fi

else

  >&2 echo "No package $CIRCLE_SHA.tar.gz to deliver."
  exit 1

fi

# 0 means found; else not.
exit $code
