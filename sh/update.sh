#!/bin/bash
# Updates the existing local and origin branches corresponding to the remix

if [ "$1" == "-h" ]; then
  echo "Usage: ensure you're in the Community Git Repo" 
  echo "Then run: `basename $0` REMIX-NAME"
  echo "e.g. `basename $0` splendid-carol"
  exit 0
fi

git checkout $1
git pull $1 master
git push origin $1