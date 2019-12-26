# Glitch.com Continuous Integration Configuration

## Overall Development Process

1. Do your development work locally on a branch (nothing here changes, I think)
1. merge and push to `staging`
      1. CircleCI picks up the commit
            1. lints, builds, runs tests, just like it does right now
            1. `deploy.sh`
                  1. queries s3 to determine if the current commit's build archive is already present
                  1. if not, sends asset for upload
                  1. sends `deploy` command to each community worker, which runs `local-deploy.sh`, gets the asset from S3 and deploys it to the local box [remotely executed on each worker]
3. merge to `master`
      1. CircleCI picks up the commit
            1. same process as for staging @ 2.1 above, but deploying to the production boxes

## Details

### No secrets in the Glitch-Community repo

No secrets, encrypted or not, are stored in the Glitch-Community repo. CircleCI needs a few things configured to be able to do this work:

1. The environment-specific (production, staging) bootstrap secret that gives CircleCI access to our AWS environment for finding / uploading the build asset, configured in the CircleCI environment variables for the project (https://circleci.com/gh/FogCreek/Glitch-Community/edit#env-vars).
1. An ssh certificate to authenticate to the Glitch network, configured in the CircleCI SSH Permissions page at https://circleci.com/gh/FogCreek/Glitch-Community/edit#ssh. The appropriate certificate is stored in the Glitch repo.

### Resulting project structure

The overall structure, therefore, is this:

( see [diagram](https://docs.google.com/drawings/d/1KmJhEIkqhS2VBxhiZNYJSiO0iUX8IrVQW4soiHcE_0k/edit?usp=sharing) )

In the Glitch-Community repo

- .circleci
  - config.yaml - CircleCI configuration file, enhanced with the deploy job
- ci
  - deploy.sh - script run on the CircleCI executor that marshalls all the CircleCI-hosted deploy work
  - publish-build-asset.sh - script run on the CircleCI executor that checks for and uploads (if indicated) the SHA1-identified tarball of the build result for the matching commit 
  - local-deploy.sh - does the _local_ deploy work - stops the running site, cleans up the old code, pulls and unzips the new code, npm installs and runs the site. Executed on each community worker in turn via an ssh session started from the CircleCI executor.

## New hosts
The Glitch repo's bootstrap process handles spinning up new community workers and contains a bootstrap script that checks out the Glitch-Community repo (to gain access to the appropriate scripts), gets the tagged build asset from S3, and executes `local-deploy.sh` to set up new hosts. The terraform code that manages this infrastructure also exists there. Additionally, there is an S3 bucket for bootstrapping in each environment (staging / production) which contains the community project's `.env` file (downloaded during deploy) and the build assets from any released commit.