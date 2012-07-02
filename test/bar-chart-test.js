require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bar chart');

var width = 400;
var height = 150;

suite.addBatch({
    'bar chart generation': {
        topic: function() {
            d3.select("body").append("div").attr("id", "bar-chart");
            var chart = dc.barChart("#bar-chart");
            chart.dimension(dateDimension).group(dateGroup)
                .width(width).height(height)
            chart.render();
            return chart;
        },
        'we get something': function(chart) {
            assert.isNotNull(chart);
        },
        'svg should be created': function(chart) {
            assert.isFalse(chart.select("svg").empty());
        },
        'dimension should be set': function(chart) {
            assert.equal(chart.dimension(), dateDimension);
        },
        'group should be set': function(chart) {
            assert.equal(chart.group(), dateGroup);
        },
        'width should be set': function(chart) {
            assert.equal(chart.width(), width);
        },
        'height should be set': function(chart) {
            assert.equal(chart.height(), height);
        },
        'height should be used for svg': function(chart) {
            assert.equal(chart.select("svg").attr("height"), height);
        },
        'margin should be set': function(chart) {
            assert.isNotNull(chart.margin());
        },
        'root g should be created': function(chart) {
            assert.isFalse(chart.select("svg g").empty());
        },
        teardown: function(topic){
            resetAllFilters();
        }
    }
});

suite.export(module);


