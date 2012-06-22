document = require("jsdom").jsdom("<html><head></head><body></body></html>");
window = document.createWindow();
navigator = window.navigator;
CSSStyleDeclaration = window.CSSStyleDeclaration;

require("sizzle");
Sizzle = window.Sizzle;

require("d3");
require("crossfilter");

require("../dc");