[![Dependency Status](https://gemnasium.com/dc-js/dc.js.svg)](https://gemnasium.com/dc-js/dc.js)
[![Build Status](https://api.travis-ci.org/dc-js/dc.js.svg?branch=master)](http://travis-ci.org/dc-js/dc.js)
[![Sauce Status](https://saucelabs.com/buildstatus/sclevine)](https://saucelabs.com/u/sclevine)
[![NPM Status](https://badge.fury.io/js/dc.svg)](http://badge.fury.io/js/dc)
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
([markdown version](https://github.com/dc-js/dc.js/blob/develop/web/docs/api-latest.md)). For
more examples and hints please visit the [Wiki](https://github.com/dc-js/dc.js/wiki).


Support
--------------------
* [Example Site](http://dc-js.github.com/dc.js/)
* [Changelog](https://github.com/dc-js/dc.js/blob/develop/Changelog.md)
* [Frequently Asked Questions](https://github.com/dc-js/dc.js/wiki/FAQ) and [Wiki](https://github.com/dc-js/dc.js/wiki)
* [v2.0 API Reference](http://dc-js.github.io/dc.js/docs/html/) <sup>([markdown](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md))</sup> <sup>([next - v2.1](https://github.com/dc-js/dc.js/blob/develop/web/docs/api-latest.md))</sup> <sup>([last - v1.7](https://github.com/dc-js/dc.js/blob/master/web/docs/api-1.7.0.md))</sup>
* [dc.js on StackOverflow](http://stackoverflow.com/questions/tagged/dc.js) - ask questions and get help
* [User Group](https://groups.google.com/forum/?fromgroups#!forum/dc-js-user-group) ("mailing list") - discussion and longer topics
* [GitHub Issues](https://github.com/dc-js/dc.js/issues) - bug reports and feature requests

*Please direct questions and support requests to Stack Overflow or the user group. When posting to Stack Overflow, use the* `[dc.js]` *and/or* `[crossfilter]` *tags - other tags are likely to draw unwanted attention.*

Get help faster with a working example! Fork these to get started:<br>
[example jsFiddle](https://jsfiddle.net/gordonwoodhull/1hbjwxzy/) - [blank jsFiddle](https://jsfiddle.net/gordonwoodhull/kk4j0bzn/) - [example bl.ock](http://blockbuilder.org/gordonwoodhull/ecce8e32d64c662cffd5) - [blank bl.ock](http://blockbuilder.org/gordonwoodhull/9ab997c9a8d7d3380364)

CDN location
--------------------
For CDN URLs, please visit [dc.js on cdnjs.com](https://cdnjs.com/libraries/dc), select the version you want (2.0 is stable, 2.1 has breaking changes), and copy the URLs from there.

Please do not use github.io as a CDN unless you need the bleeding-edge features.

[More info on the Wiki.](https://github.com/dc-js/dc.js/wiki#cdn-location)


Install with npm
--------------------
```
npm install dc
```


Install with bower
--------------------
```
bower install dcjs
```


Install without npm
--------------------
Download
* [d3.js](https://github.com/mbostock/d3)
* [crossfilter.js](https://github.com/square/crossfilter)
* [dc.js - stable](https://github.com/dc-js/dc.js/releases)
* [dc.js - bleeding edge (master)](https://github.com/dc-js/dc.js)


How to build dc.js locally
---------------------------

### Prerequisite modules

Make sure the following packages are installed on your machine
* node.js
* npm

### Install dependencies
```
dc.js$ npm install
```

### Build and Test
```
dc.js$ grunt test
```

Developing dc.js
----------------

### Start the development server
```
dc.js$ grunt server
```

* Jasmine specs are hosted at http://localhost:8888/spec
* The stock example is at http://localhost:8888/web
* More examples are at http://localhost:8888/web/examples

License
--------------------

dc.js is an open source javascript library and licensed under
[Apache License v2](http://www.apache.org/licenses/LICENSE-2.0.html).
