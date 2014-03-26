# How to contribute

## Issue Submission Guidlines

* If you have a problem with your code, please ask your question on stackoverflow.com or the [user group](https://groups.google.com/forum/?fromgroups#!forum/dc-js-user-group)
* It will be far, far easier for others to understand your problem or bug if you demonstrate it with a short example on http://jsfiddle.net/ or on http://bl.ocks.org/
* For bugs and feature requests submit a [github issue](http://github.com/dc-js/dc.js/issues)
  * Please include the version of DC you are using
  * If you can, please try the latest version of DC on the [master](https://raw.github.com/dc-js/dc.js/master/dc.js) branch to see if your issue has already been addressed or is otherwise affected by recent changes.

## Pull Request Guidelines

* Fork the repository
* Make changes to the files in `src/` not dc.js
* Add tests to `spec/`. Feel free to create a new file if needed.
* Run `grunt server` and go to http://localhost:8888/spec to develop your tests.
* Run `grunt lint` to fix any final linting issues via jshint.
* Run `grunt test` to confirm that all tests will pass on phantomjs.
* Commit your changes to `src/*` and `spec/*` but not any build artifacts.  (Build artifacts include `dc.*js*`, `web/docs/*`, `web/js/*`)
* Submit a pull request
* If you merge master or another branch into your patchset, please rebase against master.
* The DC maintainer team will review and build the artifacts when merging
* If you continue making changes to your fork of `dc.js`, create a branch for each pull request

#### Coding Conventions

* Please try to follow the existing code formatting
* Avoid tabs and trailing whitespace

#### Testing Notes

Running `grunt server` will host the jasmine specs at http://localhost:8888/spec.
Please use `.transitionDuration(0)` for all chart tests.

# Merging Pull Requests

_for maintainers_

Ensure origin looks like this in `.git/config`. The key element here is the second fetch statement
```
[remote "origin"]
  url = git@github.com:dc-js/dc.js.git
  fetch = +refs/heads/*:refs/remotes/origin/*
  fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
```

Run these commands (or their approximation):
```
# clean master branch
git stash

# update node modules that may be pulled into `web/`
npm update

# double check your aren't going to blow away local commits
git fetch origin
git checkout master
git diff origin/master

# Merge - subsitute the PR number for $PR. Warning this runs git reset --hard, ensure you are ready
grunt merge:$PR

# manually verify the changes and review the demos/examples

# deploy
git push origin master

# review changes before site deployment
git diff origin/gh-pages master:web
grunt web
```

If needed, the baseline test for the demos can be rebuilt by running `grunt update-stock-regression`.
