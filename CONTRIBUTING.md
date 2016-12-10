# How to contribute

## Issue Submission Guidelines

If you are trying to get a particular effect or you have a problem with your code, please ask your question [on stackoverflow.com](http://stackoverflow.com/questions/tagged/dc.js) or the [user group](https://groups.google.com/forum/?fromgroups#!forum/dc-js-user-group). We use the issue tracker for bug reports and feature requests only.

Get help faster with a working example! Use [jsfiddle.net](http://jsfiddle.net) or [bl.ocks.org](http://bl.ocks.org) - [blockbuilder.org](http://blockbuilder.org/) is a great way to edit bl.ocks.

Here are some examples you can fork to get started:
  * [example jsFiddle](https://jsfiddle.net/gordonwoodhull/1hbjwxzy/) with some data and a chart.
  * [blank jsFiddle](https://jsfiddle.net/gordonwoodhull/kk4j0bzn/) using the latest dc.js from github.io
  * the same example [as a bl.ock](http://bl.ocks.org/gordonwoodhull/ecce8e32d64c662cffd5); [on blockbuilder.org](http://blockbuilder.org/gordonwoodhull/ecce8e32d64c662cffd5)
  * a blank template bl.ock [on blockbuilder.org](http://blockbuilder.org/gordonwoodhull/9ab997c9a8d7d3380364)

For bug reports and feature requests submit a [github issue](http://github.com/dc-js/dc.js/issues)
  * Please include the version of DC you are using
  * If you can, please try the latest version of DC on the [master](https://raw.github.com/dc-js/dc.js/master/dc.js) branch to see if your issue has already been addressed or is otherwise affected by recent changes.

## Pull Request Guidelines

* Fork the repository.
* As with all pull requests, put your changes in a branch. For contributions that change the dc.js API, create your branch off of `develop`. If your contribution does not change the API, branch off of `master` instead.
* Make changes to the files in `src/` not dc.js
* Add tests to `spec/`. Feel free to create a new file if needed.
* Run `grunt server` and go to http://localhost:8888/spec to develop your tests.
* If your changes might affect transitions, go to the relevant transition tests in http://localhost:8888/web/transitions and watch them by eye to see if they make sense
* Run `grunt lint` to confirm that your code meets the dc.js style guidelines.
* Run `grunt test` to confirm that all tests will pass on phantomjs.
* Commit your changes to `src/*` and `spec/*` but not any build artifacts.  (Build artifacts include `dc.*js*`, `web/docs/*`, `web/js/*`)
* Submit a pull request.
* If you merge `develop` or `master` into your patchset, please rebase against develop. (It's okay to rewrite history for PRs, because these branches are temporary and it's unlikely that anyone is tracking your feature branch.)
* The DC maintainer team will review and build the artifacts when merging.
* If you continue making changes to your fork of `dc.js`, create a separate branch for each pull request and keep the changes separate.

#### Coding Conventions

* Avoid tabs and trailing whitespace
* Please try to follow the existing code formatting
* We use jshint and jscs to verify most of our coding conventions

The default grunt task will install a git pre-commit hook `.git/hooks/pre-commit` to help verify the coding conventions. Or run `grunt lint` to check them manually.

#### Testing Notes

Running `grunt server` will host the jasmine specs at http://localhost:8888/spec.
Please use `.transitionDuration(0)` for all chart tests.
