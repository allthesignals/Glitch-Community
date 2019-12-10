# Glitch.com Continuous Integration Configuration

## Overall Process

1. local dev &#x2672;
1. push to `staging`
   1. CircleCI picks up the commit
      1. lints, builds, runs tests
      1. checks if the asset is in s3 [remotely executed on a worker]
      1. if not, sends asset for upload [remotely executed on a worker]
      1. sends `deploy` command, which gets the asset from S3 and deploys it to the local box [remotely executed on each worker]
1. merge to `master`
   1. CircleCI picks up the commit
      1. same process as for staging @ 2.1.1 above, but deploying to the production boxes

### Things I chose _not_ to do

- prevent overlapping CircleCI deploys
  - there are so few boxes, deploys should happen so uickly, and the number of simulatneous deploys is so low this didn't seem worth any effort right now
- implement `no-deploy` or `no-test` flags
  - again this didn't seem needed right away; we can implement them later if we care to
