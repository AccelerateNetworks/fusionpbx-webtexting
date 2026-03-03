# build sip.js so the next step works. not needed when using sip.js packages from npm
cd node_modules/sip.js
yarnpkg install
# these two commands are run by the "yarnpkg run build" but it explicitly invokes npm and we only have yarn, so we do this
yarnpkg run generate-grammar
yarnpkg run build-lib
cd ../..
