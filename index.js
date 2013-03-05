var globals = ["document", "window", "d3"],
    globalValues = {};

globals.forEach(function(g) {
  if (g in global) globalValues[g] = global[g];
});

require("./globals");
d3 = require("d3");
crossfilter = require("crossfilter");
require("./dc");

module.exports = dc;

globals.forEach(function(g) {
  if (g in globalValues) global[g] = globalValues[g];
  else delete global[g];
});
