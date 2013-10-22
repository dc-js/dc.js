var vows = require('vows');
var assert = require('assert');
var fs = require('fs');

var suite = vows.describe('Test web examples');

function buildPage(htmlFile,jsFile) {
    var web = function(f) { return require("path").join(__dirname,'../web/',f); };
    var page = fs.readFileSync(web(htmlFile));
    var document = global.document = require("jsdom").jsdom(page);
    var window = global.window = document.parentWindow;

    // https://github.com/chad3814/CSSStyleDeclaration/issues/3
    var CSSStyleDeclaration_prototype = window.CSSStyleDeclaration.prototype,
    CSSStyleDeclaration_setProperty = CSSStyleDeclaration_prototype.setProperty;
    CSSStyleDeclaration_prototype.setProperty = function(name, value, priority) {
        return CSSStyleDeclaration_setProperty.call(this, name + "", value == null ? null : value + "", priority == null ? null : priority + "");
    };

    document.createRange = function() {
        return {
            selectNode: function() {},
            createContextualFragment: function(html) { return jsdom.jsdom(html); }
        };
    };

    var libs = {d3:null, crossfilter:null, dc:null, colorbrewer:null};
    function loadJS(f) {
        /*jshint -W054 */
        load = new Function("window","document","d3","crossfilter","dc","colorbrewer",
                          fs.readFileSync(web(f), "utf-8") +
                            "this.d3 = d3;this.dc=dc;this.colorbrewer=colorbrewer;");
        load.call(libs, window, document, libs.d3, libs.crossfilter, libs.dc, libs.colorbrewer);
    }
    loadJS('js/d3.js');
    loadJS('js/crossfilter.js');
    loadJS('js/dc.js');
    loadJS('js/colorbrewer.js');

    // monkey patching for test

    libs.dc.disableTransitions = true;
    var parseCsv = libs.d3.csv.parse;
    libs.d3.csv = function(fileName,callback) {
        var data = fs.readFileSync(web(fileName), 'utf8');
        callback(parseCsv(data));
    };

    loadJS(jsFile);

    return document;
}

function generatePage(p) {
    var document = buildPage(p.html,p.js);
    return document.documentElement.innerHTML;
}

function savePage(p) {
    if (typeof(this) === 'function') this("Writing: " + p.baseline);
    fs.writeFileSync(p.baseline,generatePage(p));
}

function testPage(p) {
    var test = {};
    test[p.name] = {'compare against baseline render': function() {
        var generated = generatePage(p),
            baseline  = fs.readFileSync(p.baseline);
        assert.equal(generated.length, baseline.length);
        assert.equal(generated, baseline);
    }};
    return test;
}

var pages = [
  {name:"Stock Example", html:'index.html',js:'stock.js',baseline:'test/web-renders/stock.html'}
];

if (module.parent.id.match(/Gruntfile/)) {
    module.exports = function(log) {
        pages.forEach(savePage,log);
    };
}
else {
    pages.map(testPage).forEach(suite.addBatch,suite);
    suite.export(module);
}
