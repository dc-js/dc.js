document = require("jsdom").jsdom("<html><head></head><body></body></html>");
window = document.createWindow();
navigator = window.navigator;
CSSStyleDeclaration = window.CSSStyleDeclaration;

require("d3");
crossfilter = require("crossfilter");

jQuery = require("jquery");

require("./env-data");

require("../dc");
