process.env.TZ = "America/Los_Angeles";

var document = global.document = require("jsdom").jsdom("<html><head></head><body></body></html>"),
    window = global.window = document.parentWindow;

// https://github.com/chad3814/CSSStyleDeclaration/issues/3
var CSSStyleDeclaration_prototype = window.CSSStyleDeclaration.prototype,
    CSSStyleDeclaration_setProperty = CSSStyleDeclaration_prototype.setProperty;
CSSStyleDeclaration_prototype.setProperty = function(name, value, priority) {
  return CSSStyleDeclaration_setProperty.call(this, name + "", value == null ? null : value + "", priority == null ? null : priority + "");
};

require("./env-xhr");


document.createRange = function() {
  return {
    selectNode: function() {},
    createContextualFragment: function(html) { return jsdom.jsdom(html); }
  };
};

d3 = require("d3");
crossfilter = require("crossfilter");
sinon = require("sinon");

$ = jQuery = require("jquery");

require("../dc");

require("./env-data");
