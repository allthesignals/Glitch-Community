#!/bin/bash
# Pulls the latest content from prismic and saves it in the repository
# It does not commit the changes, that's still up to you :)

wget -O src/curated/home.json 'https://cms.glitch.me/home.json'
wget -O src/curated/pupdates.json 'https://cms.glitch.me/pupdates.json'