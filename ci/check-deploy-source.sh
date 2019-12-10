#!/usr/bin/env bash
set -x  #   we don't want -e or -o pipefail; we want to handle the results of the grep at the end

#####
# THIS SCRIPT RUNS ON COMMUNITY WORKERS
# It checks for the requested asset (based on the commit sha) in S3 
# and tells the caller who is responsible for the asset
#####

#   TODO
#   *   parameterize the bootstrap bucket

# check req params - we need a sha to use for file manipulation
if [ -z "$1" ]; then
  >&2 echo "Usage:"
  >&2 echo "./$(basename $0) sha"
  exit 1
fi

export CIRCLE_SHA=$1

# check S3 for the asset; tell caller the result
# aws s3 ls s3://community-bootstrap-bucket20191205165831056600000001 | grep "$CIRCLE_SHA"; code=$?
aws s3api head-object --bucket community-bootstrap-bucket20191205165831056600000001 --key "$CIRCLE_SHA.tar.gz" > /dev/null 2>&1; code=$?

# 0 means found; else not.
exit $code
