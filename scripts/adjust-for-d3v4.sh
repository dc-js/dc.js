#!/usr/bin/env bash

# Enable exit or error
set -e

# Enable echo of commands, makes it easier to ready Travis output
set -x

npm i 'd3@^4'

# Path of d3.js is different in d3v4
sed -i -e 's#node_modules/d3/dist/d3\.js#node_modules/d3/build/d3.js#' Gruntfile.js

# One of the test case varies for d3 lower than v5.1
sed -i -e 's#// changedInD3v51#changedInD3v51#' spec/color-spec.js

# Display the d3 version
npm list d3
