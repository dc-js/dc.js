# How to contribute

* Fork the repository
* Make changes the the files in `src/` not dc.js
* Add tests to `test/`. Feel free to create a new file if needed.
* Run `grunt test` and fix your patch or other tests as needed
* Commit your changes to `src/*` and `test/*` but not any build
  artifacts
* Submit a pull request
* The DC maintainer team will review and build the artifacts when
  merging

# Merging Pull Requests

_for maintainers_

Ensure origin looks like this in `.git/confg`. The key element here is the second fetch statement
```
[remote "origin"]
  url = git@github.com:NickQiZhu/dc.js.git
  fetch = +refs/heads/*:refs/remotes/origin/*
  fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
```

Run these commands (or their approximation):
```
# clean master branch
git fetch origin
git checkout master
git reset --hard origin/master

# merge
git merge -no-ff origin/pr/$1 -M "Merge pull request #$1"

# build 
grunt test docs

# add build artifacts to merge commit
git commit --amend --no-edit

# deploy
git push origin master
grunt web
```
