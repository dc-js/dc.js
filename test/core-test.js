require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Core');

suite.addBatch({
    'dc.version': {
        topic: function () { return dc.version },

        'has the form major.minor.patch': function (version) {
            assert.match(version, /^[0-9]+\.[0-9]+\.[0-9]+$/);
        }
    },
    'dc.charts': {
        topic: function(){
            var chart = dc.pieChart("#id");
            sinon.spy(chart, "filterAll");
            sinon.spy(chart, "render");
            return chart;
        },
        'should register chart object': function(chart){
            assert.isTrue(dc.hasChart(chart));
        },
        'filterAll should invoke filter on each chart': function(chart){
            dc.filterAll();
            assert.isTrue(chart.filterAll.calledOnce);
        },
        'renderAll should invoke filter on each chart': function(chart){
            dc.renderAll();
            assert.isTrue(chart.render.calledOnce);
        },
        'should be gone after remove all': function(chart){
            dc.deregisterAllCharts();
            assert.isFalse(dc.hasChart(chart));
        },
        teardown: function(){ dc.deregisterAllCharts(); }
    },
    'iso 8601 date conversion': {
        topic: function(){
            return dc.convertISO8601Date("2012-12-10T16:10:09Z");
        },
        'should be a date object': function(date){
            assert.isTrue(date instanceof Date);
        },
        'year is correct': function(date){
            assert.equal(date.getUTCFullYear(), 2012);
        },
        'month is correct': function(date){
            assert.equal(date.getUTCMonth(), 11);
        },
        'day is correct': function(date){
            assert.equal(date.getUTCDate(), 10);
        },
        'hour is correct': function(date){
            assert.equal(date.getUTCHours(), 16);
        },
        'min is correct': function(date){
            assert.equal(date.getUTCMinutes(), 10);
        },
        'sec is correct': function(date){
            assert.equal(date.getUTCSeconds(), 09);
        }
    }
});

suite.export(module);


