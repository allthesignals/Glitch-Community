#!/usr/bin/env bash
set -x #   we don't want -e or -o pipefail; we want to handle the results of the grep at the end

#####
# THIS SCRIPT RUNS ON COMMUNITY WORKERS
# it uploads the provided build asset to s3 and updates the latest sha for other users
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

source /opt/glitch-community/ci/env

#   check to see if we have the package
if [[ -f "$CIRCLE_SHA.tar.gz" ]]; then
  #   double-check to make sure we need to upload
  aws s3api head-object --bucket "$BOOTSTRAP_BUCKET" --key "$CIRCLE_SHA.tar.gz" > /dev/null 2>&1; code=$?

  if [[ "$code" -ne 0 ]]; then
    #   no file in s3
    aws s3 cp --quiet "$CIRCLE_SHA.tar.gz" "s3://$BOOTSTRAP_BUCKET"
    echo "$CIRCLE_SHA" > LAST_DEPLOYED_SHA
    aws s3 cp --quiet LAST_DEPLOYED_SHA "s3://$BOOTSTRAP_BUCKET"
  fi

else

  >&2 echo "No package $CIRCLE_SHA.tar.gz to deliver."
  exit 1

fi
