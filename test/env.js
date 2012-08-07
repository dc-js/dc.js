document = require("jsdom").jsdom("<html><head></head><body></body></html>");
window = document.createWindow();
navigator = window.navigator;
CSSStyleDeclaration = window.CSSStyleDeclaration;

require("d3");
crossfilter = require("crossfilter");
sinon = require("sinon");

jQuery = require("jquery");

require("../dc");

require("./env-xhr");
require("./env-data");
