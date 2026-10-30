#!/usr/bin/env bash

set -e

REMOTE="saffron"
REMOTE_DIR="htdocs/"

echo "Deploying Saffron Author Services..."

rsync -avz \
    --delete \
    --exclude '.git/' \
    --exclude '.gitignore' \
    --exclude 'deploy.sh' \
    --exclude 'README.md' \
    ./ "$REMOTE:$REMOTE_DIR"

echo
echo "Deployment complete."
echo "https://saffronauthorservices.com"
