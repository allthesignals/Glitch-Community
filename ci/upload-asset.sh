#!/usr/bin/env bash
set -x #   we don't want -e or -o pipefail; we want to handle the results of the grep at the end

#####
# THIS SCRIPT RUNS ON COMMUNITY WORKERS
# it uploads the provided build asset to s3 and updates the latest sha for other users
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

#   check to see if we have the package
if [[ -f "$CIRCLE_SHA.tar.gz" ]]; then
  #   double-check to make sure we need to upload
  aws s3api head-object --bucket community-bootstrap-bucket20191205165831056600000001 --key "$CIRCLE_SHA.tar.gz" > /dev/null 2>&1; code=$?

  if [[ "$code" -ne 0 ]]; then
    #   no file in s3
    aws s3 cp --quiet "$CIRCLE_SHA.tar.gz" s3://community-bootstrap-bucket20191205165831056600000001
    echo "$CIRCLE_SHA" > LAST_DEPLOYED_SHA
    aws s3 cp --quiet LAST_DEPLOYED_SHA s3://community-bootstrap-bucket20191205165831056600000001
  fi

else

  >&2 echo "No package $CIRCLE_SHA.tar.gz to deliver."
  exit 1

fi
