#!/bin/bash
set -o allexport; source .env; set +o allexport
npx percy exec -- npx cypress open --config baseUrl=https://$1.glitch.me
