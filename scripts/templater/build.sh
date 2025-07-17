#!/bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

build() {
    basename="$1"

    npx esbuild "$basename.ts" --bundle --platform=node --format=cjs --outfile=$basename.js
}

pushd $SCRIPT_DIR

build start_log
build stop_log
build open_timeline_log

popd
