[![Build Status](https://api.travis-ci.org/dc-js/dc.js.png?branch=master)](http://travis-ci.org/dc-js/dc.js)
[![NPM Status](https://badge.fury.io/js/dc.png)](http://badge.fury.io/js/dc)

dc.js
=====

Dimensional charting built to work natively with crossfilter rendered using d3.js. Check out the
[example page](http://dc-js.github.com/dc.js/) with a quick five minutes how to guide. For a
detailed [API reference](https://github.com/dc-js/dc.js/blob/master/web/docs/api-1.6.0.md) and
more please visit the [Wiki](https://github.com/dc-js/dc.js/wiki).


Install with npm
--------------------
```
npm install dc
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

### Run example site on local web server
```
dc.js$ grunt run-examples:8888
```
After running this command go to [http://localhost:8888](http://localhost:8888) to see the main dc.js example page or
[http://localhost:8888/examples](http://localhost:8888/examples) to see an index of additional examples.

License
--------------------

dc.js is an open source javascript library and licensed under
[Apache License v2](http://www.apache.org/licenses/LICENSE-2.0.html).
