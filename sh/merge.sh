#!/bin/bash
# Updates the local master branch with origin/master, merges it with the latest 
# from the live community site, and then pushes that back up to origin/master

if [ "$1" == "-h" ]; then
  echo "Usage: ensure you're in the Community Git Repo" 
  echo "Then run: `basename $0`"
  exit 0
fi

curl https://community.glitch.me/api/home > src/curated/home.json
git add src/curated/home.json
git commit -m "update home page content"

git pull master
git pull live master
git push origin $1
