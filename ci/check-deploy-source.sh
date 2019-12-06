#!/usr/bin/env bash
set -x  #   we don't want -e or -o pipefail; we want to handle the results of the grep at the end

#   TODO
#   *   parameterize the bootstrap bucket

# check req params - we need a sha to use for file manipulation
if [ -z "$1" ]; then
  >&2 echo "Usage:"
  >&2 echo "./$(basename $0) sha"
  exit 1
fi

export CIRCLE_SHA=$1

#   check S3 for the asset; tell caller the result
aws s3 ls s3://community-bootstrap-bucket20191205165831056600000001 | grep -q "$CIRCLE_SHA"; code=$?

if [[ "$code" -eq 0 ]]; then
    echo "S3"
else
    echo "CIRCLE"
fi