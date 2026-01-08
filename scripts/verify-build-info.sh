#!/bin/bash
set -e

# Extract the commit SHA from the build-info.js file
GENERATED_SHA=$(grep "commit:" js/build-info.js | sed "s/.*commit: '\(.*\)'/\1/")

# Get the current commit SHA from git
CURRENT_SHA=$(git rev-parse HEAD)

# Compare the two SHAs
if [ "$GENERATED_SHA" != "$CURRENT_SHA" ]; then
  echo "Error: js/build-info.js is out of date."
  echo "Please run scripts/generate-build-info.sh and commit the changes."
  echo "Generated SHA: $GENERATED_SHA"
  echo "Current SHA:  $CURRENT_SHA"
  exit 1
else
  echo "js/build-info.js is up to date."
  exit 0
fi
