require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bar chart');

var width = 200;
var height = 100;

suite.addBatch({
    'creation by selector': {
        topic: function () {
            d3.select("body").append("div").attr("id", "barchart");
            return dc.createBarChart("#barchart");
        },
        'we get something': function(barChart) {
            assert.isNotNull(barChart);
        },
        'we get barchart instance': function (barChart) {
            assert.isTrue(barChart instanceof dc.BarChart);
        },
        'svg should be created': function(barChart){
            assert.isFalse(d3.select("#barchart").select("svg").empty());
        }
    },
    'dimensional slice generation by groups': {
        topic: function(){
            d3.select("body").append("div").attr("id", "barchart");
            var chart = dc.createBarChart("#barchart");
            chart.dimension(ageDimension).group(ageGroup).width(width).height(height);
            return chart;
        },
        'dimension should be set': function(barChart){
            assert.equal(ageDimension, barChart.dimension());
        },
        'group should be set': function(barChart){
            assert.equal(ageGroup, barChart.group());
        },
        'width should be set': function(barChart){
            assert.equal(width, barChart.width());
        },
        'height should be set': function(barChart){
            assert.equal(height, barChart.height());
        },
        'root g should be created': function(barChart){
            assert.isFalse(d3.select("#barchart").select("svg").select("g").empty());
        }
    }
});

suite.export(module);


