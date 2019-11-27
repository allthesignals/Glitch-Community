#!/bin/bash
# Runs `prettier` on our code
npx prettier --config /app/.prettierrc --ignore-path /app/.prettierignore --write "/app/{server,src}/**/*.js"