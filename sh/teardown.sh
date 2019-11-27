#!/bin/bash
# Deletes the git remote and branch corresponding to a remix

if [ "$1" == "-h" ]; then
  echo "Usage: ensure you're in the Community Git Repo" 
  echo "Then run: `basename $0` REMIX-NAME"
  echo "e.g. `basename $0` splendid-carol"
  echo "Add --force to the end if you have not merged the branch but still want to delete"
  exit 0
fi

git checkout master

# we have to pass in the "force" parameter if the branch was not yet merged
if [ "$2" == "--force" ]
then
	git branch -D $1
else
	git branch -d $1
fi
git remote remove $1