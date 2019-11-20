#!/usr/bin/env bash

#   we're treating all the environments (master / prod, staging) the same here aside from which hosts we'll deploy to
#   if we need some env-specific info or tasks then we'll need to add them here or in a subscript

#   this env variable is set in the env setup in Glitch. 
#   I don't know if community needs this so I'm leaving it here temporarily
if [ "${NO_DEPLOY}" ]; then
  exit
fi

#   do we need to prevent overlapping deploys?
#   probably a good idea, but we'll need to find somewhere to do it
#   I suppose we could do so on the hosts but that wouldn't provide us the early escape that this does
#   in any case this is unhelpful
# echo "Mark deploy and wait for current host cleanup..."

# ssh -q worker.${BASE_DOMAIN_DEPLOY} << EOF &> cleanup.out
#   set -e
#   echo -n "Marking deploy... "
#   curl -sf -X POST localhost:8085/deploy/mark &> /dev/null
#   echo "done"
#   echo -n "Waiting current cleanup to finish... "
#   curl -sf -X POST localhost:8085/project_hosts/cleanup &> /dev/null
#   echo "done"
# EOF
# if [ $? -ne 0 ]; then
#   cat cleanup.out
#   echo ""
#   echo ""
#   echo "Error while marking the deploy: perhaps another deploy was in progress?"
#   exit 1
# fi
# echo "Done waiting for current cleanup."

#   we don't need this _maybe_, it's all the bootstrap stuff from the cf template
#   although there's some AWS stuff generally that I think we may need to hook into somewhere
# ci/asg-bootstrap-deploy; code=$?

#   we don't need to do _this_ work, just some other, similar work
# if [ $code -eq 0 ]; then
#   ci/run-on-deployable-hosts ${BASE_DOMAIN_DEPLOY} ci/puppet-local ${ENVIRONMENT} ${REF}; code=$?
# fi
# if [ $code -eq 0 ]; then
#   ci/run-on-deployable-hosts ${BASE_DOMAIN_DEPLOY} ci/backend-local; code=$?
# fi

####
#   in run-on-deployable-hosts we
#   1   get the list of hosts to update
#   2   parallelly ssh to each of those hosts - we probably don't want or need parallelism right now
#   3   run the above listed scripts, with retry
#       3a  both scripts are already being run by the normal bootstrap, so we shouldn't need them again
#       3b  puppet-local gets the repo, decrypts it, and runs the puppet-apply script
#       3c  backewnd-local switches on role and runs the approproate script
#       3d  for docker-workers this is basicall migrations, compiles, and restarts
#   4   for our purposes, we really just want to push the build artefact to the devices as is - they should already be compiled
#       4a  then restart the node process
#           this will complicate bootstrap, since we need to get the correct artefacts when spinning up a new host.
#           this probably means storing them in s3, which complicates things - future step

#   if we're not doing the shared marking then we don't need the shared unmarking
# echo -n "Marking deploy finished... "
# ssh -q deploy@worker.${BASE_DOMAIN_DEPLOY} << EOF &> /dev/null
#   curl -sf -X POST localhost:8085/deploy/unmark &> /dev/null
# EOF

# hard-coded push deploy
scp -o 'ProxyJump jump.staging.glitch.com' -o StrictHostKeyChecking=no /home/circleci/build.tar.gz deploy@community-0A5C26.staging:/opt/Glitch-Community; code=$?
# ssh -q -o "StrictHostKeyChecking no" $i.production "${CMD}"

if [ $code -ne 0 ]; then
  echo "Deploy failed"
  exit $code
fi

echo "Deploy succeeded"
