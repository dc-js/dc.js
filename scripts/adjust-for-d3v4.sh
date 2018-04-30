#!/usr/bin/env bash

npm i 'd3@^4'

sed -i -e 's#node_modules/d3/dist/d3\.js#node_modules/d3/build/d3.js#' Gruntfile.js

sed -i -e 's#// changedInD3v51#changedInD3v51#' spec/color-spec.js
