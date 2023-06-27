#!/bin/bash
set -exuo pipefail

# prepare the build image. Does as a separate step to take advantage of caching
podman build -t webtexting-frontend-builder -f - . <<EOF
FROM debian:bookworm
RUN apt-get update && apt-get install -y yarnpkg && apt-get clean
EOF

podman run --rm -v $(pwd):/build/webtexting -w /build/webtexting -i webtexting-frontend-builder bash -x <<EOF
yarnpkg install
node_modules/.bin/vite build --emptyOutDir
EOF
