#!/usr/bin/env sh

scripts/check_merge_conflict.py `git diff --name-only --cached` && grunt jshint
