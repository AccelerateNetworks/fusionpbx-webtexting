#!/bin/bash
set -exuo pipefail

# prepare the build image. Does as a separate step to take advantage of caching
podman build -t webtexting-frontend-builder -f - . <<EOF
FROM debian:bookworm
RUN apt-get update && apt-get install -y yarnpkg git node-typescript && apt-get clean
EOF

podman run --rm -v $(pwd):/build/webtexting -w /build/webtexting -i webtexting-frontend-builder bash -x <<EOF
set -exu
yarnpkg install

# build sip.js so the next step works. not needed when using sip.js packages from npm
cd node_modules/sip.js
yarnpkg install

# these two commands are run by the "yarnpkg run build" but it explicitly invokes npm and we only have yarn, so we do this
yarnpkg run generate-grammar
yarnpkg run build-lib
cd ../..

mkdir -p js # if js/ doesn't already exist it won't make it and it will dump the .js files right next to the .ts files and then it wont rebuild
node_modules/.bin/vite build --emptyOutDir
EOF
