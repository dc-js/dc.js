require("./core");

require("util").puts(JSON.stringify({
  "name": "dc",
  "version": dc.version,
  "description": "A multi-dimensional charting library built to work natively with crossfilter and rendered using d3.js ",
  "keywords": ["visualization", "svg", "animation", "canvas", "chart", "dimensional"],
  "homepage": "http://nickqizhu.github.io/dc.js/",
  "author": {"name": "Nick Zhu", "url": "http://nzhu.blogspot.ca/"},
  "repository": {"type": "git", "url": "https://github.com/NickQiZhu/dc.js.git"},
  "dependencies": {
    "crossfilter": "1.x",
    "d3": "3.x"
  },
  "devDependencies": {
    "uglify-js": "2.2.x",
    "vows": "0.7.x",
    "jsdom": "0.5.x",
    "jquery": "1.8.x",
    "sinon": "1.5.x"
  },
  "scripts": {"test": "./node_modules/vows/bin/vows"}
}, null, 2));
