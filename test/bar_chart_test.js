require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bar chart');

var width = 200;
var height = 200;

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
            assert.isFalse(barChart.select("svg").empty());
        }
    },
    'dimensional slice generation by groups': {
        topic: function(){
            d3.select("body").append("div").attr("id", "barchart");
            var chart = dc.createBarChart("#barchart");
            chart.dimension(ageDimension).group(ageGroup).width(width).height(height);
            chart.render();
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
        'height should be used for svg': function(barChart){
            assert.equal(height, barChart.select("svg").attr("height"));
        },
        'root g should be created': function(barChart){
            assert.isFalse(barChart.select("svg").select("g").empty());
        },
        'root g should be created': function(barChart){
            assert.isFalse(barChart.select("svg").select("g").empty());
        },
        'root g should be translated to center': function(barChart){
            assert.equal("translate(100,100)", barChart.select("svg").select("g").attr("transform"));
        }
    }
});

suite.export(module);


