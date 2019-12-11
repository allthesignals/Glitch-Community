# Glitch.com Continuous Integration Configuration

## Overall Process

1. local dev &#x2672;
1. push to `staging`
   1. CircleCI picks up the commit
      1. lints, builds, runs tests, just like it does right now
      1. checks if the asset is in s3 [remotely executed on a worker]
      1. if not, sends asset for upload [remotely executed on a worker]
      1. sends `deploy` command, which gets the asset from S3 and deploys it to the local box [remotely executed on each worker]
1. merge to `master`
   1. CircleCI picks up the commit
      1. same process as for staging @ 2.1.1 above, but deploying to the production boxes
      1. there's nothing in this process that indicates that staging has to be involved. If you want to have folks PR directly against / merge directly into `master` that should also work just as well.

## Details

### No secrets in the Glitch-Community repo

A central tenet to the community CI work is that the community repo shouldn't house any secrets (even encrypted ones). This means that any information we need to get from somewhere else (AWS, primarily) needs to be proxied through something that has the appropriate permissions. To avoid additional complexity, I just relied on the built-in access that the community host machines already have by virtue of them living in our infrastructure and already having the Glitch repo in place. The downside to this is that this CI process is tightly tied to the GLitch CI process in a number of ways, so when that process changes this process will have to undergo corresponding changes. There are a few touchpoints in the Glitch code that represent this link, so I don't think there'll be major changes to the Glitch deploy process without some attention paid here, but it's worth noting.

### Resulting project structure

The overall structure, therefore, is this:

<img src="https://docs.google.com/drawings/d/e/2PACX-1vQ8a7ZR7fitvDBGCAULTXrcTwzK-4U-8m4UW91DGdfLVZXbEb41eM-V2BgazuF4QMgBJbnyKEH1GcMu/pub?w=1440&amp;h=1080">

In the Glitch-Community repo

- .circleci
  |
  - config.yaml - CircleCI configuration file, enhanced with the deploy job
- ci
  |
  - deploy.sh - script run on the CircleCI executor; marshalls the deploy behavior that takes place on the community hosts themselves
  |
  - (these files all run on the hosts in the Glitch Infrastructure)
  - check-deploy-source.sh - checks to see if the asset for the current sha is in S3
  - upload-asset.sh - handles uploading the provided asset to the appropriate bucket and marking the correct sha
  - local-deploy.sh - does the deploy work - stops the running site, cleans up the old code, pulls and unzips the new code, npm installs and runs the site

In the Glitch repo there is a bootstrap script that helps new community hosts get the right code as well as the terraform code that manages these devices.

In S3 there is a bucket for bootstrapping in each environment (staging / production). This bucket contains the community project's `.env` file (downloaded during deploy) and the build assets from any released commit. We'll eventually want to clean up these assets. We could potentially use this bucket or something like it for storing the static assets from [ch4794](https://app.clubhouse.io/glitch/story/4797/plan-how-to-host-static-assets-outside-of-a-glitch-project).

### (Some of the) Remaining work

* I think it might be worthwhile to add some level of tracing to this process in the future
* finish production infra (s3 bootstrapping bucket and the like)
* connect `master` to prod infra and test some deploys
* flip to prod infra

### Things I chose _not_ to do

* prevent overlapping CircleCI deploys
  * there are so few boxes, deploys should happen so uickly, and the number of simulatneous deploys is so low this didn't seem worth any effort right now
* implement `no-deploy` or `no-test` flags
  8 again this didn't seem needed right away; we can implement them later if we care to
