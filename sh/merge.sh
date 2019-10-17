#!/bin/bash
# Updates the local master branch with origin/master, merges it with the latest 
# from the live community site, and then pushes that back up to origin/master

if [ "$1" == "-h" ]; then
  echo "Usage: ensure you're in the Community Git Repo" 
  echo "Then run: `basename $0`"
  exit 0
fi

git checkout master
git pull
git pull live master
git push origin master
