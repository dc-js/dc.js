require("./core");

require("util").puts(JSON.stringify({
  "name": "dc",
  "version": dc.version,
  "description": "A multi-dimensional charting built to work natively with crossfilter rendered using d3.js ",
  "keywords": ["visualization", "svg", "animation", "canvas", "chart", "dimensional"],
  "homepage": "http://nickqizhu.github.com/dc.js/",
  "author": {"name": "Nick Zhu", "url": "http://nzhu.blogspot.ca/"},
  "repository": {"type": "git", "url": "https://github.com/NickQiZhu/dc.js.git"},
  "dependencies": {
    "crossfilter": "1.1.0",
    "d3": "2.10.3"
  },
  "devDependencies": {
    "uglify-js": "2.2.1",
    "vows": "0.7.0",
    "jsdom": "0.2.19",
    "jquery": "1.8.3",
    "sinon": "1.5   .2"
  },
  "scripts": {"test": "./node_modules/vows/bin/vows"}
}, null, 2));