[![Build Status](https://api.travis-ci.org/dc-js/dc.js.svg?branch=master)](http://travis-ci.org/dc-js/dc.js)
[![Sauce Status](https://saucelabs.com/buildstatus/sclevine)](https://saucelabs.com/u/sclevine)
[![NPM Status](https://badge.fury.io/js/dc.svg)](http://badge.fury.io/js/dc)
[![cdnjs Status](https://img.shields.io/cdnjs/v/dc?color=green)](https://cdnjs.com/libraries/dc)
[![Join the chat at https://gitter.im/dc-js/dc.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dc-js/dc.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

dc.js
=====

Dimensional charting built to work natively with [crossfilter](http://crossfilter.github.io/crossfilter/)
rendered using [d3.js](https://d3js.org/). In dc.js, each chart displays an aggregation of some
attributes through the position, size, and color of its elements, and also presents a dimension
which can be filtered. When the filter or brush changes, all other charts are updated dynamically,
using animated transitions.

Check out the [example page](http://dc-js.github.com/dc.js/)
and its [annotated source](http://dc-js.github.io/dc.js/docs/stock.html) for a quick five minute
how-to guide. The detailed [API reference is here](http://dc-js.github.io/dc.js/docs/html/)
([markdown version](https://github.com/dc-js/dc.js/blob/master/docs/api-latest.md)). For
more examples and hints please visit the [Wiki](https://github.com/dc-js/dc.js/wiki).


Support
--------------------
* [Example Site](http://dc-js.github.com/dc.js/)
* [Changelog](https://github.com/dc-js/dc.js/blob/develop/Changelog.md)
* [Frequently Asked Questions](https://github.com/dc-js/dc.js/wiki/FAQ) and [Wiki](https://github.com/dc-js/dc.js/wiki)
* [v4.0 API Reference](http://dc-js.github.io/dc.js/docs/html/) <sup>([markdown](https://github.com/dc-js/dc.js/blob/master/docs/api-latest.md))</sup> <sup>([last - v3.1.9](https://github.com/dc-js/dc.js/blob/master/docs/old-api-docs/api-3.1.9.md))</sup>
* [dc.js on StackOverflow](http://stackoverflow.com/questions/tagged/dc.js) - ask questions and get help
* [User Group](https://groups.google.com/forum/?fromgroups#!forum/dc-js-user-group) ("mailing list") - discussion and longer topics
* [GitHub Issues](https://github.com/dc-js/dc.js/issues) - bug reports and feature requests

*Please direct questions and support requests to Stack Overflow or the user group. When posting to Stack Overflow, use the* `[dc.js]` *and/or* `[crossfilter]` *tags - other tags are likely to draw unwanted attention.*

Get help faster with a working example! Fork these to get started:<br>
[blank jsFiddle](https://jsfiddle.net/gordonwoodhull/rL82bguk/1) - [example jsFiddle](https://jsfiddle.net/gordonwoodhull/5ztavmjy/2) - [blank bl.ock](https://blockbuilder.org/gordonwoodhull/f6bab3d2f5b34018548207014b4056bf) - [example bl.ock](https://blockbuilder.org/gordonwoodhull/bcf9eaa0bfc2c84373cffac06d5755e5)

## Versioning
Version 4.* is compatible with d3 versions 4 and 5. It is not compatible with IE. Use dc.js 3.* if you need IE support, or use dc.js 2.* if you need compatibility with d3 version 3.

## CDN location

```
https://unpkg.com/dc@4/dist/dc.js
https://unpkg.com/dc@4/dist/style/dc.css
```

or copy the latest links from [CDNJS](https://cdnjs.com/libraries/dc)


Install with npm
--------------------
```
npm install dc
```


Install without npm
--------------------
Download
* [d3.js](https://github.com/mbostock/d3)
* [crossfilter.js](https://github.com/crossfilter/crossfilter)
* [dc.js - stable](https://github.com/dc-js/dc.js/releases)
* [dc.js - bleeding edge (develop)](https://github.com/dc-js/dc.js)


How to build dc.js locally
---------------------------

### Prerequisite modules

Make sure the following packages are installed on your machine
* node.js
* npm

### Install dependencies
```
$ npm install
```

### Build and Test
```
$ grunt test
```

Developing dc.js
----------------

### Start the development server
```
$ grunt server
```

* Jasmine specs are hosted at http://localhost:8888/spec
* The stock example is at http://localhost:8888/web
* More examples are at http://localhost:8888/web/examples

License
--------------------

dc.js is an open source javascript library and licensed under
[Apache License v2](http://www.apache.org/licenses/LICENSE-2.0.html).
