#!/usr/bin/env bash
set -x  #   we don't want -e or -o pipefail; we want to handle the results of the grep at the end

#####
# THIS SCRIPT RUNS ON COMMUNITY WORKERS
# It checks for the requested asset (based on the commit sha) in S3 
# and tells the caller who is responsible for the asset
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

# check S3 for the asset; tell caller the result
aws s3api head-object --bucket "$BOOTSTRAP_BUCKET" --key "$CIRCLE_SHA.tar.gz" > /dev/null 2>&1; code=$?

# 0 means found; else not.
exit $code
