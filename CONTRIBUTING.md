# How to contribute

## Issue Submission Guidlines

* Because of the volume of requests, we do not use the issue tracker for support questions. If you are trying to get a particular effect or you have a problem with your code, please ask your question on stackoverflow.com or the [user group](https://groups.google.com/forum/?fromgroups#!forum/dc-js-user-group)
* It will be far, far easier for others to understand your problem or bug if you demonstrate it with a short example on http://jsfiddle.net/ or on http://bl.ocks.org/
* For bugs and feature requests submit a [github issue](http://github.com/dc-js/dc.js/issues)
  * Please include the version of DC you are using
  * If you can, please try the latest version of DC on the [master](https://raw.github.com/dc-js/dc.js/master/dc.js) branch to see if your issue has already been addressed or is otherwise affected by recent changes.

## Pull Request Guidelines

* Fork the repository
* Make changes to the files in `src/` not dc.js
* Add tests to `spec/`. Feel free to create a new file if needed.
* Run `grunt server` and go to http://localhost:8888/spec to develop your tests.
* Run `grunt lint` to confirm that your code meets the dc.js style guidelines.
* Run `grunt test` to confirm that all tests will pass on phantomjs.
* Commit your changes to `src/*` and `spec/*` but not any build artifacts.  (Build artifacts include `dc.*js*`, `web/docs/*`, `web/js/*`)
* Submit a pull request
* If you merge master or another branch into your patchset, please rebase against master.
* The DC maintainer team will review and build the artifacts when merging
* If you continue making changes to your fork of `dc.js`, create a branch for each pull request

#### Coding Conventions

* Avoid tabs and trailing whitespace
* Please try to follow the existing code formatting
* We use jshint and jscs to verify most of our coding conventions

It helps keep on top of the conventions if you create a git pre-commit hook `.git/hooks/pre-commit`:
```
#!/usr/bin/env sh

grunt jshint
grunt jscs
```

(You also need to make it executable with  `chmod u+x .git/hooks/pre-commit`)

Or you can just run the commands manually before committing.

#### Testing Notes

Running `grunt server` will host the jasmine specs at http://localhost:8888/spec.
Please use `.transitionDuration(0)` for all chart tests.

